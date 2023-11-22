import { ForceGraph2D } from 'react-force-graph';
import LINK_TYPE_ENUM from '../../types/LinkTypeEnum';
import generateLinkName from '../../utils/parseLinkName';
import { useGraph } from '../../providers/GraphProvider';
import { useMemo } from 'react';

export default function GraphModule() {
    const { nodes, links, comments, getTag } = useGraph();

    const graphData = useMemo(() => {
        const linkPairs: number[][] = [];
        return {
            nodes: nodes.map((node) => {
                return {
                    id: node.id,
                    label: node.name,
                    x: 0,
                    y: 0,
                    group: node.tags?.[0] || (Math.random() * -100).toString(),
                    name:
                        comments.find((c) => c.targetId === node.id)?.text ||
                        '',
                };
            }),
            links: links.map((link) => {
                const label =
                    link.type === LINK_TYPE_ENUM.A_TO_B
                        ? link.name
                        : generateLinkName(
                              {
                                  ...link,
                              },
                              '',
                              ''
                          );

                const firstNode = Math.min(link.node1Id, link.node2Id);
                const secondNode = Math.max(link.node1Id, link.node2Id);
                const timesFound = linkPairs.filter(
                    (pair) => pair[0] === firstNode && pair[1] === secondNode
                ).length;
                linkPairs.push([firstNode, secondNode]);

                const linkComments = comments.filter(
                    (c) => c.targetId === link.id
                );

                return {
                    id: link.id,
                    source: { id: link.node1Id, x: 0, y: 0 },
                    sourceId: link.node1Id,
                    target: { id: link.node2Id, x: 0, y: 0 },
                    targetId: link.node2Id,
                    label:
                        label +
                        (linkComments.length ? ` *${linkComments.length}` : ''),
                    name:
                        linkComments.reduce(
                            (prev, c, i) => `${prev}#${i + 1} ${c.text}; `,
                            ''
                        ) ||
                        (link.node1Id === link.node2Id
                            ? generateLinkName(link, '', '')
                            : ''),
                    comments: linkComments,
                    type: link.type,
                    curvature:
                        link.node1Id === link.node2Id
                            ? 0.3 + timesFound * 0.1
                            : timesFound * 0.15,
                };
            }),
        };
    }, [nodes, links, comments]);

    return (
        <ForceGraph2D
            height={window.innerHeight - 250}
            width={window.innerWidth - 250}
            backgroundColor="white"
            graphData={graphData}
            nodeCanvasObject={(node, ctx) => {
                const label = node.label;
                const fontSize = 3;
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(
                    (n) => n + fontSize * 1
                ); // some padding

                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillRect(
                    node.x! - bckgDimensions[0] / 2,
                    node.y! - bckgDimensions[1] / 2,
                    bckgDimensions[0],
                    bckgDimensions[1]
                );

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = getTag(node.group)?.color || '#000';
                ctx.fillText(label, node.x!, node.y!);

                node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
            }}
            nodePointerAreaPaint={(node, color, ctx) => {
                ctx.fillStyle = color;
                const bckgDimensions = node.__bckgDimensions;
                bckgDimensions &&
                    ctx.fillRect(
                        node.x! - bckgDimensions[0] / 2,
                        node.y! - bckgDimensions[1] / 2,
                        bckgDimensions[0],
                        bckgDimensions[1]
                    );
            }}
            linkCurvature="curvature"
            linkSource="sourceId"
            linkTarget="targetId"
            linkCanvasObjectMode={() => 'after'}
            linkDirectionalArrowLength={(link) =>
                link.type === LINK_TYPE_ENUM.A_TO_B ? 1 : 0
            }
            linkDirectionalArrowRelPos={0.8}
            linkCanvasObject={(
                link: {
                    id: number;
                    source: { id: number; x: number; y: number };
                    target: { id: number; x: number; y: number };
                    label: string;
                    curvature: number;
                    type: LINK_TYPE_ENUM;
                },
                ctx
            ) => {
                const source = link.source;
                const target = link.target;

                const label = link.label;

                // estimate fontSize to fit in link length
                ctx.font = '1px Sans-Serif';
                const fontSize = 1;
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(
                    (n) => n + fontSize * 1
                ); // some padding

                // draw text label (with background rect)
                ctx.save();

                // calculate label positioning
                const textPos = {
                    x: source.x + (target.x - source.x) / 2,
                    y: source.y + (target.y - source.y) / 2,
                };

                const curvatureVector = {
                    x: target.y - source.y,
                    y: source.x - target.x,
                };

                const textPosCurvature = {
                    x: textPos.x + curvatureVector.x * (link.curvature / 2),
                    y: textPos.y + curvatureVector.y * (link.curvature / 2),
                };

                ctx.translate(textPosCurvature.x, textPosCurvature.y);

                const relLink = {
                    x: target.x - source.x,
                    y: target.y - source.y,
                };

                let textAngle = Math.atan2(relLink.y, relLink.x);
                // maintain label vertical orientation for legibility
                if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
                if (textAngle < -Math.PI / 2)
                    textAngle = -(-Math.PI - textAngle);

                ctx.rotate(textAngle);

                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillRect(
                    -bckgDimensions[0] / 2,
                    -bckgDimensions[1] / 2,
                    bckgDimensions[0],
                    bckgDimensions[1]
                );

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'darkgrey';
                ctx.fillText(label, 0, 0);
                ctx.restore();
            }}
        />
    );
}
