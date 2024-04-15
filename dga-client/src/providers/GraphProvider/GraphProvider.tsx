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
}: IGraphProviderProps) {
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
        const loadedGraph = loadGraph({ name: graphName });
        if (loadedGraph) {
            initGraph(loadedGraph);
        } else {
            throw new Error(`Graph ${graphName} not found`);
        }
    });

    const handleClearGraph = React.useCallback(() => {
        clearGraph({ id: graphId });
        loadGraph({ name: graphName });
    }, [clearGraph, graphId, graphName, loadGraph]);

    const handleLoadGraph = React.useCallback(
        (newName: string) => {
            const graph = loadGraph({ name: newName });
            if (graph) {
                initGraph(graph);
            } else {
                throw new Error(`Graph ${newName} not found`);
            }
        },
        [initGraph, loadGraph]
    );

    const handleAddComment = React.useCallback(
        (comment: NewComment | IComment) => {
            const createdComment = createComment({ graphId, comment });
            setComments((prevComments) => [...prevComments, createdComment]);
            return createdComment;
        },
        [createComment, graphId]
    );

    const handleDeleteComment = React.useCallback(
        (id: IdType) => {
            deleteComment({ graphId, commentId: id });
            initGraph(loadGraph({ name: graphName }));
        },
        [deleteComment, graphId, graphName, initGraph, loadGraph]
    );

    const handleUpdateComment = React.useCallback(
        (id: IdType, comment: IComment) => {
            setComments((prevComments) =>
                prevComments.map((prevComment) =>
                    prevComment.id === id
                        ? updateComment({ graphId, comment })
                        : prevComment
                )
            );
        },
        [graphId, updateComment]
    );

    const handleAddLink = React.useCallback(
        (link: NewLink | ILink) => {
            const createdLink = createLink({ graphId, link });
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
        (id: IdType, link: ILink) => {
            setLinks((prevLinks) =>
                prevLinks.map((prevLink) =>
                    prevLink.id === id
                        ? updateLink({ graphId, link })
                        : prevLink
                )
            );
        },
        [graphId, updateLink]
    );

    const handleAddNode = React.useCallback(
        (node: NewNode | INode) => {
            const createdNode = createNode({ graphId, node });
            setNodes((prevNodes) => [...prevNodes, createdNode]);
            return createdNode;
        },
        [createNode, graphId]
    );

    const handleDeleteNode = React.useCallback(
        (id: IdType) => {
            deleteNode({ graphId, nodeId: id });
            initGraph(loadGraph({ name: graphName }));
        },
        [deleteNode, graphId, graphName, initGraph, loadGraph]
    );

    const handleUpdateNode = React.useCallback(
        (id: IdType, node: INode) => {
            setNodes((prevNodes) =>
                prevNodes.map((prevNode) =>
                    prevNode.id === id
                        ? updateNode({ graphId, node })
                        : prevNode
                )
            );
        },
        [graphId, updateNode]
    );

    const handleAddTag = React.useCallback(
        (tag: NewTag | ITag) => {
            const createdTag = createTag({ graphId, tag });
            setTags((prevTags) => [...prevTags, createdTag]);
            return createdTag;
        },
        [createTag, graphId]
    );

    const handleDeleteTag = React.useCallback(
        (id: IdType) => {
            deleteTag({ graphId, tagId: id });
            initGraph(loadGraph({ name: graphName }));
        },
        [deleteTag, graphId, graphName, initGraph, loadGraph]
    );

    const handleUpdateTag = React.useCallback(
        (id: IdType, tag: ITag) => {
            setTags((prevTags) =>
                prevTags.map((prevTag) =>
                    prevTag.id === id ? updateTag({ graphId, tag }) : prevTag
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
