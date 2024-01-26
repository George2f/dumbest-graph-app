import React, { useEffect, useMemo } from 'react';
import INode from '../../types/INode';
import ILink from '../../types/ILink';
import IComment from '../../types/IComment';
import IdType from '../../types/IdType';
import IGraph from '../../types/IGraph';
import ITag from '../../types/ITag';
import { useGraphPersistence } from '../../contexts/GraphPersistenceContext';
import debounce from '../../utils/debounce';

const GraphContext = React.createContext<IGraph>({} as IGraph);

interface IGraphProviderProps {
    children: React.ReactNode;
    defaultGraphId: string;
}

export default function GraphProvider({
    children,
    defaultGraphId,
}: IGraphProviderProps) {
    const { saveGraph, loadGraph } = useGraphPersistence();
    const [initialized, setInitialized] = React.useState(false);
    const [graphId, setGraphId] = React.useState(defaultGraphId || 'graph');
    const [nextId, setNextId] = React.useState<IdType>(1);
    const [nodes, setNodes] = React.useState<INode[]>([]);
    const [links, setLinks] = React.useState<ILink[]>([]);
    const [comments, setComments] = React.useState<IComment[]>([]);
    const [tags, setTags] = React.useState<ITag[]>([]);

    const initGraph = React.useCallback(
        ({
            nodes = [],
            links = [],
            comments = [],
            tags = [],
        }: {
            nodes: INode[];
            links: ILink[];
            comments: IComment[];
            tags: ITag[];
        }) => {
            const lastId = Math.max(
                0,
                ...nodes.map((node) => node.id),
                ...links.map((link) => link.id),
                ...comments.map((comment) => comment.id),
                ...tags.map((tag) => tag.id)
            );
            setNextId(lastId + 1);
            setNodes(nodes);
            setLinks(links);
            setComments(comments);
            setTags(tags);
        },
        []
    );

    const persistGraph = useMemo(() => debounce(saveGraph, 1000), [saveGraph]);

    useEffect(() => {
        const loadedGraph = loadGraph({ name: graphId });
        if (loadedGraph) {
            initGraph(loadedGraph);
        }
        setInitialized(true);
    }, [graphId, initGraph, loadGraph]);

    useEffect(() => {
        if (!initialized) return;
        persistGraph({
            name: graphId,
            graph: { nodes, links, comments, tags },
        });
    }, [
        nodes,
        links,
        comments,
        initialized,
        tags,
        saveGraph,
        graphId,
        persistGraph,
    ]);

    const handleClearGraph = React.useCallback(() => {
        setNodes([]);
        setLinks([]);
        setComments([]);
        setTags([]);
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

    const handleEditLink = React.useCallback((id: IdType, link: ILink) => {
        setLinks((prevLinks) =>
            prevLinks.map((prevLink) => (prevLink.id === id ? link : prevLink))
        );
    }, []);

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

            const commentsToDelete = comments
                .filter((comment) => comment.targetId === id)
                .concat(
                    comments.filter((comment) =>
                        linksToDelete.find(
                            (link) => link.id === comment.targetId
                        )
                    )
                );

            commentsToDelete.forEach((comment) => {
                handleDeleteComment(comment.id);
            });
        },
        [comments, handleDeleteComment, handleDeleteLink, links]
    );

    const handleEditNode = React.useCallback((id: IdType, node: INode) => {
        setNodes((prevNodes) =>
            prevNodes.map((prevNode) => (prevNode.id === id ? node : prevNode))
        );
    }, []);

    const handleAddTag = React.useCallback((tag: ITag) => {
        setTags((prevTags) => [...prevTags, tag]);
    }, []);

    const handleDeleteTag = React.useCallback(
        (id: IdType) => {
            setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));

            nodes.forEach((node) => {
                if (node.tags.includes(id)) {
                    handleEditNode(node.id, {
                        ...node,
                        tags: node.tags.filter((tagId) => tagId !== id),
                    });
                }
            });
        },
        [handleEditNode, nodes]
    );

    const handleEditTag = React.useCallback((id: IdType, tag: ITag) => {
        setTags((prevTags) =>
            prevTags.map((prevTag) => (prevTag.id === id ? tag : prevTag))
        );
    }, []);

    const getNode = React.useCallback(
        (id: IdType) => nodes.find((node) => node.id === id),
        [nodes]
    );

    const getLink = React.useCallback(
        (id: IdType) => links.find((link) => link.id === id),
        [links]
    );

    const getComment = React.useCallback(
        (id: IdType) => comments.find((comment) => comment.id === id),
        [comments]
    );

    const getTag = React.useCallback(
        (id: IdType) => tags.find((tag) => tag.id === id),
        [tags]
    );

    return (
        <GraphContext.Provider
            value={{
                getNewId,
                nodes,
                links,
                comments,
                tags,
                initGraph,
                clearGraph: handleClearGraph,
                addNode: handleAddNode,
                addComment: handleAddComment,
                addLink: handleAddLink,
                deleteComment: handleDeleteComment,
                deleteLink: handleDeleteLink,
                deleteNode: handleDeleteNode,
                editComment: handleEditComment,
                editLink: handleEditLink,
                editNode: handleEditNode,
                addTag: handleAddTag,
                deleteTag: handleDeleteTag,
                editTag: handleEditTag,
                getNode,
                getLink,
                getComment,
                getTag,
                graphId,
                setGraphId,
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
