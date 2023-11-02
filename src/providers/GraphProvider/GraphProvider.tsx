import React, { useEffect } from 'react';
import INode from '../../types/INode';
import ILink from '../../types/ILink';
import IComment from '../../types/IComment';
import IdType from '../../types/IdType';
import parseLinkName from '../../utils/parseLinkName';

interface IGraphContextValue {
    getNewId: () => IdType;
    nodes: INode[];
    links: ILink[];
    comments: IComment[];
    initGraph: ({
        nodes,
        links,
        comments,
    }: {
        nodes: INode[];
        links: ILink[];
        comments: IComment[];
    }) => void;
    clearGraph: () => void;
    addNode: (node: INode) => void;
    addComment: (comment: IComment) => void;
    addLink: (link: ILink) => void;
    deleteComment: (id: IdType) => void;
    deleteLink: (id: IdType) => void;
    deleteNode: (id: IdType) => void;
    editComment: (id: IdType, comment: IComment) => void;
    editLink: (id: IdType, link: ILink) => void;
    editNode: (id: IdType, node: INode) => void;
}
const GraphContext = React.createContext<IGraphContextValue>(
    {} as IGraphContextValue
);

interface IGraphProviderProps {
    children: React.ReactNode;
}

export default function GraphProvider({ children }: IGraphProviderProps) {
    const [initialized, setInitialized] = React.useState(false);
    const [nextId, setNextId] = React.useState<IdType>(1);
    const [nodes, setNodes] = React.useState<INode[]>([]);
    const [links, setLinks] = React.useState<ILink[]>([]);
    const [comments, setComments] = React.useState<IComment[]>([]);

    const initGraph = React.useCallback(
        ({
            nodes,
            links,
            comments,
        }: {
            nodes: INode[];
            links: ILink[];
            comments: IComment[];
        }) => {
            const lastId = Math.max(
                0,
                ...nodes.map((node) => node.id),
                ...links.map((link) => link.id),
                ...comments.map((comment) => comment.id)
            );
            setNextId(lastId + 1);
            setNodes(nodes);
            setLinks(links);
            setComments(comments);
        },
        []
    );

    useEffect(() => {
        const graph = localStorage.getItem('graph');
        if (graph) {
            const { nodes, links, comments } = JSON.parse(graph);
            initGraph({
                nodes: nodes || [],
                links: links || [],
                comments: comments || [],
            });
        }
        setInitialized(true);
    }, [initGraph]);

    useEffect(() => {
        if (!initialized) return;
        localStorage.setItem(
            'graph',
            JSON.stringify({ nodes, links, comments })
        );
    }, [nodes, links, comments, initialized]);

    const clearGraph = React.useCallback(() => {
        setNodes([]);
        setLinks([]);
        setComments([]);
    }, []);

    const getNewId = React.useCallback(() => {
        setNextId((prevId) => prevId + 1);
        return nextId;
    }, [nextId]);

    const addNode = React.useCallback((node: INode) => {
        setNodes((prevNodes) => [...prevNodes, node]);
    }, []);

    const deleteNode = React.useCallback((id: IdType) => {
        setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
        const deletedLinks: IdType[] = [];
        setLinks((prevLinks) =>
            prevLinks.filter((link) => {
                const stays = link.node1Id !== id && link.node2Id !== id;
                if (!stays) deletedLinks.push(link.id);
                return stays;
            })
        );
        setComments((prevComments) =>
            prevComments.filter(
                (comment) =>
                    comment.targetId !== id ||
                    deletedLinks.includes(comment.targetId)
            )
        );
    }, []);

    const editNode = React.useCallback((id: IdType, node: INode) => {
        setNodes((prevNodes) =>
            prevNodes.map((prevNode) => {
                if (prevNode.id === id) {
                    return node;
                }
                return prevNode;
            })
        );
        setLinks((prevLinks) =>
            prevLinks.map((prevLink) => {
                return {
                    ...prevLink,
                    node1Name:
                        prevLink.node1Id === id
                            ? node.name
                            : prevLink.node1Name,
                    node2Name:
                        prevLink.node2Id === id
                            ? node.name
                            : prevLink.node2Name,
                };
            })
        );
        setComments((prevComments) =>
            prevComments.map((prevComment) => {
                if (prevComment.targetId === id) {
                    return { ...prevComment, targetName: node.name };
                }
                return prevComment;
            })
        );
    }, []);

    const addLink = React.useCallback((link: ILink) => {
        setLinks((prevLinks) => [...prevLinks, link]);
    }, []);

    const deleteLink = React.useCallback((id: IdType) => {
        setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
        setComments((prevComments) =>
            prevComments.filter((comment) => comment.targetId !== id)
        );
    }, []);

    const editLink = React.useCallback((id: IdType, link: ILink) => {
        setLinks((prevLinks) =>
            prevLinks.map((prevLink) => {
                if (prevLink.id === id) {
                    return link;
                }
                return prevLink;
            })
        );
        setComments((prevComments) =>
            prevComments.map((prevComment) => {
                if (prevComment.targetId === id) {
                    return { ...prevComment, targetName: parseLinkName(link) };
                }
                return prevComment;
            })
        );
    }, []);

    const addComment = React.useCallback((comment: IComment) => {
        setComments((prevComments) => [...prevComments, comment]);
    }, []);

    const deleteComment = React.useCallback((id: IdType) => {
        setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== id)
        );
    }, []);

    const editComment = React.useCallback((id: IdType, comment: IComment) => {
        setComments((prevComments) =>
            prevComments.map((prevComment) => {
                if (prevComment.id === id) {
                    return comment;
                }
                return prevComment;
            })
        );
    }, []);

    return (
        <GraphContext.Provider
            value={{
                getNewId,
                nodes,
                links: links,
                comments,
                initGraph,
                clearGraph,
                addNode,
                addComment,
                addLink,
                deleteComment,
                deleteLink,
                deleteNode,
                editComment,
                editLink,
                editNode,
            }}>
            {children}
        </GraphContext.Provider>
    );
}

export function useGraph() {
    const context = React.useContext(GraphContext);
    if (!context) {
        throw new Error('useGraph must be used within a GraphProvider');
    }
    return context;
}
