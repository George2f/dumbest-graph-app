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

    const handleAddComment = React.useCallback((comment: IComment) => {
        setComments((prevComments) => [...prevComments, comment]);
    }, []);

    const handleDeleteComment = React.useCallback((id: IdType) => {
        setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== id)
        );
    }, []);

    const handleEditComment = React.useCallback(
        (id: IdType, comment: IComment) => {
            setComments((prevComments) =>
                prevComments.map((prevComment) =>
                    prevComment.id === id ? comment : prevComment
                )
            );
        },
        []
    );

    const handleAddLink = React.useCallback((link: ILink) => {
        setLinks((prevLinks) => [...prevLinks, link]);
    }, []);

    const handleDeleteLink = React.useCallback(
        (id: IdType) => {
            setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));

            const commentsToDelete = comments.filter(
                (comment) => comment.targetId === id
            );

            commentsToDelete.forEach((comment) =>
                handleDeleteComment(comment.id)
            );
        },
        [comments, handleDeleteComment]
    );

    const handleEditLink = React.useCallback(
        (id: IdType, link: ILink) => {
            setLinks((prevLinks) =>
                prevLinks.map((prevLink) =>
                    prevLink.id === id ? link : prevLink
                )
            );

            const commentsToEdit = comments.filter(
                (comment) => comment.targetId === id
            );

            commentsToEdit.forEach((comment) => {
                handleEditComment(comment.id, {
                    ...comment,
                    targetName: parseLinkName(link),
                });
            });
        },
        [comments, handleEditComment]
    );

    const handleAddNode = React.useCallback((node: INode) => {
        setNodes((prevNodes) => [...prevNodes, node]);
    }, []);

    const handleDeleteNode = React.useCallback(
        (id: IdType) => {
            setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
            const linksToDelete = links.filter(
                (link) => link.node1Id === id || link.node2Id === id
            );

            linksToDelete.forEach((link) => {
                handleDeleteLink(link.id);
            });

            const commentsToDelete = comments.filter(
                (comment) => comment.targetId === id
            );

            commentsToDelete.forEach((comment) => {
                handleDeleteComment(comment.id);
            });
        },
        [comments, handleDeleteComment, handleDeleteLink, links]
    );

    const handleEditNode = React.useCallback(
        (id: IdType, node: INode) => {
            setNodes((prevNodes) =>
                prevNodes.map((prevNode) =>
                    prevNode.id === id ? node : prevNode
                )
            );

            const linksToEdit = links.filter(
                (link) => link.node1Id === id || link.node2Id === id
            );

            linksToEdit.forEach((link) => {
                handleEditLink(link.id, {
                    ...link,
                    node1Name: link.node1Id === id ? node.name : link.node1Name,
                    node2Name: link.node2Id === id ? node.name : link.node2Name,
                });
            });

            const commentsToEdit = comments.filter(
                (comment) => comment.targetId === id
            );

            commentsToEdit.forEach((comment) => {
                handleEditComment(comment.id, {
                    ...comment,
                    targetName: node.name,
                });
            });
        },
        [comments, handleEditComment, handleEditLink, links]
    );

    return (
        <GraphContext.Provider
            value={{
                getNewId,
                nodes,
                links: links,
                comments,
                initGraph,
                clearGraph,
                addNode: handleAddNode,
                addComment: handleAddComment,
                addLink: handleAddLink,
                deleteComment: handleDeleteComment,
                deleteLink: handleDeleteLink,
                deleteNode: handleDeleteNode,
                editComment: handleEditComment,
                editLink: handleEditLink,
                editNode: handleEditNode,
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
