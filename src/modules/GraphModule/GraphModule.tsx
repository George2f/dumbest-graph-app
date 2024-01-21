import { ForceGraph2D } from 'react-force-graph';
import LINK_TYPE_ENUM from '../../types/LinkTypeEnum';
import generateLinkName from '../../utils/parseLinkName';
import { useGraph } from '../../providers/GraphProvider';
import { useEffect, useMemo, useState } from 'react';
import Button from '../../components/Button';
import clsx from 'clsx';
import TagPill from '../../components/TagPill';

export default function GraphModule() {
    const { nodes, links, comments, getTag, tags } = useGraph();
    const [highlightTags, setHighlightTags] = useState<number[]>([]);
    const [isHighlightCross, setIsHighlightCross] = useState<boolean>(false);
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [selectedNode, setSelectedNode] = useState<number | undefined>();
    const [relatedNodes, setRelatedNodes] = useState<number[]>([]);

    useEffect(() => {
        window.onresize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        return () => {
            window.onresize = null;
        };
    }, []);

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
                    link.type === LINK_TYPE_ENUM.BOTH_WAYS
                        ? generateLinkName(
                              {
                                  ...link,
                              },
                              '',
                              ''
                          )
                        : link.name;

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

    const highlightedNodes = useMemo(() => {
        return nodes
            .filter((node) => {
                if (isHighlightCross) {
                    return highlightTags.every((tagId) =>
                        node.tags.includes(tagId)
                    );
                }

                return node.tags.some((tagId) => highlightTags.includes(tagId));
            })
            .map((node) => node.id);
    }, [nodes, highlightTags, isHighlightCross]);

    return (
        <div className="flex flex-col">
            <div className="mb-2 ml-2 mt-2 flex flex-row flex-wrap gap-1.5">
                {highlightTags.length > 0 ? (
                    <Button
                        className={clsx('px-4 py-0', {
                            ['bg-green-300']: isHighlightCross,
                        })}
                        onClick={() => setIsHighlightCross((prev) => !prev)}>
                        Must have all
                    </Button>
                ) : null}
                {highlightTags.map((tagId) => (
                    <TagPill
                        key={tagId}
                        tag={getTag(tagId)!}
                        onDelete={() => {
                            setHighlightTags(
                                highlightTags.filter((tag) => tag !== tagId)
                            );
                        }}
                    />
                ))}
                <select
                    className="rounded-full bg-zinc-200 px-2 py-0.5 hover:bg-zinc-200  active:bg-zinc-300"
                    onChange={(e) => {
                        setHighlightTags([
                            ...highlightTags,
                            Number.parseInt(e.target.value),
                        ]);
                    }}
                    value="">
                    {tags
                        .filter((tag) => !highlightTags.includes(tag.id))
                        .map((tag) => (
                            <option key={tag.id} value={tag.id}>
                                {tag.name}
                            </option>
                        ))}
                    <option value={''} className="text-xs">
                        {highlightTags.length === 0
                            ? 'Highlight'
                            : 'Add Highlight tag'}
                    </option>
                </select>
            </div>
            <ForceGraph2D
                height={dimensions.height - dimensions.height / 3}
                width={dimensions.width}
                backgroundColor="white"
                graphData={graphData}
                nodeCanvasObject={(node, ctx) => {
                    const isHighlighted = highlightedNodes.includes(node.id);
                    const isSelected = selectedNode === node.id;
                    const isRelated = relatedNodes.includes(node.id);

                    const label = node.label;
                    const fontSize =
                        isHighlighted || isSelected || isRelated ? 3.6 : 3.1;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(
                        (n) => n + fontSize * 1
                    ); // some padding

                    // paint border rectangle
                    if (isSelected || isRelated) {
                        ctx.fillStyle = getTag(node.group)?.color || '#000';
                        ctx.fillRect(
                            node.x! - bckgDimensions[0] / 2,
                            node.y! - bckgDimensions[1] / 2 - 1.2,
                            bckgDimensions[0],
                            bckgDimensions[1] + 2.4
                        );
                    } else if (isHighlighted) {
                        ctx.fillStyle = '#ff0000';
                        ctx.fillRect(
                            node.x! - bckgDimensions[0] / 2,
                            node.y! - bckgDimensions[1] / 2 - 1.2,
                            bckgDimensions[0],
                            bckgDimensions[1] + 2.4
                        );
                    } else {
                        ctx.fillStyle = getTag(node.group)?.color || '#000';
                        ctx.fillRect(
                            node.x! - bckgDimensions[0] / 2 + 1,
                            node.y! - bckgDimensions[1] / 2 - 0.2,
                            bckgDimensions[0] - 2,
                            bckgDimensions[1] + 0.4
                        );
                    }

                    // paint background rectangle
                    ctx.fillStyle = 'rgb(255, 255, 255, 0.9)';
                    ctx.fillRect(
                        node.x! - bckgDimensions[0] / 2,
                        node.y! - bckgDimensions[1] / 2,
                        bckgDimensions[0],
                        bckgDimensions[1]
                    );

                    // paint text
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = isHighlighted ? '#000' : '#444444';
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
                    const fontSize = 1.5;
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
                    if (textAngle > Math.PI / 2)
                        textAngle = -(Math.PI - textAngle);
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
                onNodeDragEnd={(node) => {
                    node.fx = node.x;
                    node.fy = node.y;
                }}
                onNodeClick={(node) => {
                    if (selectedNode === node.id) {
                        setSelectedNode(undefined);
                        setRelatedNodes([]);
                        return;
                    }

                    setSelectedNode(node.id);
                    setRelatedNodes(
                        links
                            .filter(
                                (link) =>
                                    link.node1Id === node.id ||
                                    link.node2Id === node.id
                            )
                            .map((link) =>
                                link.node1Id === node.id
                                    ? link.node2Id
                                    : link.node1Id
                            )
                    );
                }}
            />
        </div>
    );
}
