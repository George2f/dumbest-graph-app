import React from 'react';
import INode, { NewNode } from '../../types/INode';
import ILink, { NewLink } from '../../types/ILink';
import IComment, { NewComment } from '../../types/IComment';
import IdType from '../../types/IdType';
import IGraph from '../../types/IGraph';
import ITag, { NewTag } from '../../types/ITag';
import { useGraphPersistence } from '../../persistence/GraphPersistenceContext';
import useMount from '../../utils/useMount';

const GraphContext = React.createContext<IGraph>({} as IGraph);

interface IGraphProviderProps {
    children: React.ReactNode;
    defaultGraphId: IdType;
    defaultGraphName: string;
}

export default function GraphProvider({
    children,
    defaultGraphId,
    defaultGraphName,
}: Readonly<IGraphProviderProps>) {
    const {
        clearGraph,
        createComment,
        createLink,
        createNode,
        createTag,
        deleteComment,
        deleteLink,
        deleteNode,
        deleteTag,
        updateComment,
        updateLink,
        updateNode,
        updateTag,
        loadGraph,
    } = useGraphPersistence();
    const [graphId, setGraphId] = React.useState<IdType>(defaultGraphId || 1);
    const [graphName, setGraphName] = React.useState<string>(
        defaultGraphName || 'Graph'
    );
    const [nodes, setNodes] = React.useState<INode[]>([]);
    const [links, setLinks] = React.useState<ILink[]>([]);
    const [comments, setComments] = React.useState<IComment[]>([]);
    const [tags, setTags] = React.useState<ITag[]>([]);

    const initGraph = React.useCallback(
        ({
            id,
            name,
            nodes = [],
            links = [],
            comments = [],
            tags = [],
        }: {
            id: IdType;
            name: string;
            nodes: INode[];
            links: ILink[];
            comments: IComment[];
            tags: ITag[];
        }) => {
            setGraphId(id);
            setGraphName(name);
            setNodes(nodes);
            setLinks(links);
            setComments(comments);
            setTags(tags);
        },
        []
    );

    useMount(() => {
        loadGraph({ name: graphName }).then((loadedGraph) => {
            if (loadedGraph) {
                initGraph(loadedGraph);
            } else {
                throw new Error(`Graph ${graphName} not found`);
            }
        });
    });

    const handleClearGraph = React.useCallback(() => {
        clearGraph({ id: graphId });
        loadGraph({ name: graphName });
    }, [clearGraph, graphId, graphName, loadGraph]);

    const handleLoadGraph = React.useCallback(
        async (newName: string) => {
            const graph = await loadGraph({ name: newName });
            if (graph) {
                initGraph(graph);
            } else {
                throw new Error(`Graph ${newName} not found`);
            }
        },
        [initGraph, loadGraph]
    );

    const handleAddComment = React.useCallback(
        async (comment: NewComment | IComment) => {
            const createdComment = await createComment({ graphId, comment });
            setComments((prevComments) => [...prevComments, createdComment]);
            return createdComment;
        },
        [createComment, graphId]
    );

    const handleDeleteComment = React.useCallback(
        async (id: IdType) => {
            deleteComment({ graphId, commentId: id });
            initGraph(await loadGraph({ name: graphName }));
        },
        [deleteComment, graphId, graphName, initGraph, loadGraph]
    );

    const handleUpdateComment = React.useCallback(
        async (id: IdType, comment: IComment) => {
            const updatedComment = await updateComment({ graphId, comment });
            setComments((prevComments) =>
                prevComments.map((prevComment) =>
                    prevComment.id === id ? updatedComment : prevComment
                )
            );
        },
        [graphId, updateComment]
    );

    const handleAddLink = React.useCallback(
        async (link: NewLink | ILink) => {
            const createdLink = await createLink({ graphId, link });
            setLinks((prevLinks) => [...prevLinks, createdLink]);
            return createdLink;
        },
        [createLink, graphId]
    );

    const handleDeleteLink = React.useCallback(
        (id: IdType) => {
            deleteLink({ graphId, linkId: id });
            loadGraph({ name: graphName });
        },
        [deleteLink, graphId, graphName, loadGraph]
    );

    const handleUpdateLink = React.useCallback(
        async (id: IdType, link: ILink) => {
            const updatedLink = await updateLink({ graphId, link });
            setLinks((prevLinks) =>
                prevLinks.map((prevLink) =>
                    prevLink.id === id ? updatedLink : prevLink
                )
            );
        },
        [graphId, updateLink]
    );

    const handleAddNode = React.useCallback(
        async (node: NewNode | INode) => {
            const createdNode = await createNode({ graphId, node });
            setNodes((prevNodes) => [...prevNodes, createdNode]);
            return createdNode;
        },
        [createNode, graphId]
    );

    const handleDeleteNode = React.useCallback(
        async (id: IdType) => {
            deleteNode({ graphId, nodeId: id });
            initGraph(await loadGraph({ name: graphName }));
        },
        [deleteNode, graphId, graphName, initGraph, loadGraph]
    );

    const handleUpdateNode = React.useCallback(
        async (id: IdType, node: INode) => {
            const updatedNode = await updateNode({ graphId, node });
            setNodes((prevNodes) =>
                prevNodes.map((prevNode) =>
                    prevNode.id === id ? updatedNode : prevNode
                )
            );
        },
        [graphId, updateNode]
    );

    const handleAddTag = React.useCallback(
        async (tag: NewTag | ITag) => {
            const createdTag = await createTag({ graphId, tag });
            setTags((prevTags) => [...prevTags, createdTag]);
            return createdTag;
        },
        [createTag, graphId]
    );

    const handleDeleteTag = React.useCallback(
        async (id: IdType) => {
            deleteTag({ graphId, tagId: id });
            initGraph(await loadGraph({ name: graphName }));
        },
        [deleteTag, graphId, graphName, initGraph, loadGraph]
    );

    const handleUpdateTag = React.useCallback(
        async (id: IdType, tag: ITag) => {
            const updatedTag = await updateTag({ graphId, tag });
            setTags((prevTags) =>
                prevTags.map((prevTag) =>
                    prevTag.id === id ? updatedTag : prevTag
                )
            );
        },
        [graphId, updateTag]
    );

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
                updateComment: handleUpdateComment,
                updateLink: handleUpdateLink,
                updateNode: handleUpdateNode,
                addTag: handleAddTag,
                deleteTag: handleDeleteTag,
                updateTag: handleUpdateTag,
                getNode,
                getLink,
                getComment,
                getTag,
                graphId,
                name: graphName,
                loadGraph: handleLoadGraph,
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
