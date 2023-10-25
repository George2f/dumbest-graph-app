import React, { useEffect } from 'react';
import INode from '../../types/INode';
import IEdge from '../../types/IEdge';
import IComment from '../../types/IComment';
import IdType from '../../types/IdType';

interface IGraphContextValue {
    getNewId: () => IdType;
    nodes: INode[];
    edges: IEdge[];
    comments: IComment[];
    initGraph: ({
        nodes,
        edges,
        comments,
    }: {
        nodes: INode[];
        edges: IEdge[];
        comments: IComment[];
    }) => void;
    addNode: (node: INode) => void;
    addComment: (comment: IComment) => void;
    addEdge: (edge: IEdge) => void;
    deleteComment: (id: IdType) => void;
    deleteEdge: (id: IdType) => void;
    deleteNode: (id: IdType) => void;
    editComment: (id: IdType, comment: IComment) => void;
    editEdge: (id: IdType, edge: IEdge) => void;
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
    const [edges, setEdges] = React.useState<IEdge[]>([]);
    const [comments, setComments] = React.useState<IComment[]>([]);

    const initGraph = React.useCallback(
        ({
            nodes,
            edges,
            comments,
        }: {
            nodes: INode[];
            edges: IEdge[];
            comments: IComment[];
        }) => {
            const lastId = Math.max(
                ...nodes.map((node) => node.id),
                ...edges.map((edge) => edge.id),
                ...comments.map((comment) => comment.id)
            );
            setNextId(lastId + 1);
            setNodes(nodes);
            setEdges(edges);
            setComments(comments);
        },
        []
    );

    useEffect(() => {
        const graph = localStorage.getItem('graph');
        if (graph) {
            const { nodes, edges, comments } = JSON.parse(graph);
            initGraph({ nodes, edges, comments });
        }
        setInitialized(true);
    }, [initGraph]);

    useEffect(() => {
        if (!initialized) return;
        localStorage.setItem(
            'graph',
            JSON.stringify({ nodes, edges, comments })
        );
    }, [nodes, edges, comments, initialized]);

    const getNewId = React.useCallback(() => {
        setNextId((prevId) => prevId + 1);
        return nextId;
    }, [nextId]);

    const addNode = React.useCallback((node: INode) => {
        setNodes((prevNodes) => [...prevNodes, node]);
    }, []);

    const deleteNode = React.useCallback((id: IdType) => {
        setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
        setEdges((prevEdges) =>
            prevEdges.filter(
                (edge) => edge.node1Id !== id && edge.node2Id !== id
            )
        );
        setComments((prevComments) =>
            prevComments.filter((comment) => comment.targetId !== id)
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
        setEdges((prevEdges) =>
            prevEdges.map((prevEdge) => {
                if (prevEdge.node1Id === id) {
                    return { ...prevEdge, node1Name: node.name };
                }
                if (prevEdge.node2Id === id) {
                    return { ...prevEdge, node2Name: node.name };
                }
                return prevEdge;
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

    const addEdge = React.useCallback((edge: IEdge) => {
        setEdges((prevEdges) => [...prevEdges, edge]);
    }, []);

    const deleteEdge = React.useCallback((id: IdType) => {
        setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== id));
        setComments((prevComments) =>
            prevComments.filter((comment) => comment.targetId !== id)
        );
    }, []);

    const editEdge = React.useCallback((id: IdType, edge: IEdge) => {
        setEdges((prevEdges) =>
            prevEdges.map((prevEdge) => {
                if (prevEdge.id === id) {
                    return edge;
                }
                return prevEdge;
            })
        );
        setComments((prevComments) =>
            prevComments.map((prevComment) => {
                if (prevComment.targetId === id) {
                    return { ...prevComment, targetName: edge.name };
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
                edges,
                comments,
                initGraph,
                addNode,
                addComment,
                addEdge,
                deleteComment,
                deleteEdge,
                deleteNode,
                editComment,
                editEdge,
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
