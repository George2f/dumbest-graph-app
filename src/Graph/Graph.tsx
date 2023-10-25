import React from 'react';
import { useGraph } from '../providers/GraphProvider';
import INode from '../types/INode';
import IEdge from '../types/IEdge';
import IComment from '../types/IComment';
import EDGE_TYPE_ENUM from '../types/EdgeTypeEnum';
import parseEdgeName from '../utils/parseEdgeName';

export default function Graph() {
    const {
        nodes,
        edges,
        comments,
        initGraph,
        addNode,
        addEdge,
        addComment,
        editNode,
        editEdge,
        editComment,
        deleteNode,
        deleteEdge,
        deleteComment,
        getNewId,
    } = useGraph();

    const [newNodeName, setNewNodeName] = React.useState<string>('');

    const [workingNode, setWorkingNode] = React.useState<INode | null>(null);
    const [editNodeName, setEditNodeName] = React.useState<string>('');

    const [newCommentText, setNewCommentText] = React.useState<string>('');
    const [newCommentTargetNode, setNewCommentTargetNode] =
        React.useState<INode | null>(null);
    const [newCommentTargetEdge, setNewCommentTargetEdge] =
        React.useState<IEdge | null>(null);

    const [workingComment, setWorkingComment] = React.useState<IComment | null>(
        null
    );
    const [editCommentText, setEditCommentText] = React.useState<string>('');

    const [newEdgeName, setNewEdgeName] = React.useState<string>('');
    const [newEdgeType, setNewEdgeType] = React.useState<EDGE_TYPE_ENUM>(
        EDGE_TYPE_ENUM.SIMPLE
    );
    const [newEdgeNode1, setNewEdgeNode1] = React.useState<INode | null>(null);
    const [newEdgeNode2, setNewEdgeNode2] = React.useState<INode | null>(null);

    const [workingEdge, setWorkingEdge] = React.useState<IEdge | null>(null);
    const [editEdgeName, setEditEdgeName] = React.useState<string>('');
    const [editEdgeType, setEditEdgeType] = React.useState<EDGE_TYPE_ENUM>(
        EDGE_TYPE_ENUM.SIMPLE
    );

    const [exportFileName, setExportFileName] =
        React.useState<string>('data.json');

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                height: 'calc(100vh - 16px)',
            }}>
            <header>
                <h1>
                    DGA - Dumbest Graph App{' '}
                    <button
                        onClick={() => {
                            const fileInput = document.createElement('input');
                            fileInput.type = 'file';
                            fileInput.accept = 'application/json';
                            fileInput.onchange = (e) => {
                                const files = (e.target as HTMLInputElement)
                                    .files;
                                if (!files || !files[0]) return;
                                setExportFileName(files[0].name.split('.')[0]);
                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    if (!e.target || !e.target.result) return;
                                    const data = JSON.parse(
                                        e.target.result as string
                                    );
                                    initGraph(data);
                                };
                                reader.readAsText(files[0]);
                            };
                            fileInput.click();
                        }}>
                        Import
                    </button>
                    <form
                        style={{ display: 'inline' }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!exportFileName) return;
                            const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                                JSON.stringify({ nodes, edges, comments })
                            )}`;
                            const link = document.createElement('a');
                            link.href = jsonString;
                            link.download = `${exportFileName}.json`;

                            link.click();
                        }}>
                        <button type="submit">Export</button>
                        <input
                            value={exportFileName}
                            onChange={(e) => setExportFileName(e.target.value)}
                            type="text"
                        />
                    </form>
                </h1>
            </header>
            <main
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    overflow: 'auto',
                    borderBottom: '1px solid grey',
                    borderTop: '1px solid grey',
                }}>
                <section>
                    <h2>Nodes</h2>
                    <h3>New Node</h3>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!newNodeName) return;
                            addNode({ id: getNewId(), name: newNodeName });
                            setNewNodeName('');
                        }}>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={newNodeName}
                                onChange={(event) =>
                                    setNewNodeName(event.target.value)
                                }
                            />
                        </label>
                        <button type="submit">Add Node</button>
                    </form>
                    <h3>Edit Node</h3>
                    <ul>
                        {nodes.map((node) => (
                            <li key={node.id}>
                                {workingNode?.id === node.id ? (
                                    <>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                if (!workingNode) return;
                                                if (!editNodeName) return;
                                                editNode(workingNode.id, {
                                                    ...workingNode,
                                                    name: editNodeName,
                                                });
                                                setWorkingNode(null);
                                                setEditNodeName('');
                                            }}>
                                            <input
                                                type="text"
                                                value={editNodeName}
                                                onChange={(event) =>
                                                    setEditNodeName(
                                                        event.target.value
                                                    )
                                                }
                                            />
                                            <button type="submit">Save</button>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        {node.id}{' '}
                                        <button
                                            onClick={() => {
                                                setWorkingNode(node);
                                                setEditNodeName(node.name);
                                            }}>
                                            {node.name}
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        deleteNode(node.id);
                                    }}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
                <section>
                    <h2>Edges</h2>
                    <h3>New Edge</h3>
                    <h4>Choose a node</h4>
                    <select
                        onChange={(event) => {
                            setNewEdgeNode1(
                                nodes.find(
                                    (node) =>
                                        node.id.toString() ===
                                        event.target.value
                                ) || null
                            );
                        }}
                        value={newEdgeNode1?.id || 0}>
                        <option value={0}>--</option>
                        {nodes.map((node) => (
                            <option key={node.id} value={node.id}>
                                {node.name}
                            </option>
                        ))}
                    </select>
                    <h4>And another one</h4>
                    <select
                        onChange={(event) => {
                            setNewEdgeNode2(
                                nodes.find(
                                    (node) =>
                                        node.id.toString() ===
                                        event.target.value
                                ) || null
                            );
                        }}
                        value={newEdgeNode2?.id || 0}>
                        <option value={0}>--</option>
                        {nodes.map((node) => (
                            <option key={node.id} value={node.id}>
                                {node.name}
                            </option>
                        ))}
                    </select>
                    <h4>How do they relate</h4>
                    <select
                        onChange={(event) => {
                            setNewEdgeType(
                                event.target.value as unknown as EDGE_TYPE_ENUM
                            );
                        }}
                        value={newEdgeType}>
                        <option value={EDGE_TYPE_ENUM.SIMPLE}>Simple</option>
                        <option value={EDGE_TYPE_ENUM.A_TO_B}>A to B</option>
                        <option value={EDGE_TYPE_ENUM.BOTH_WAYS}>
                            Both Ways
                        </option>
                    </select>
                    <h4>
                        What do you call this relationship? (e.g. "is a friend")
                    </h4>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!newEdgeNode1 || !newEdgeNode2) return;
                            addEdge({
                                id: getNewId(),
                                node1Id: newEdgeNode1.id,
                                node1Name: newEdgeNode1.name,
                                node2Id: newEdgeNode2.id,
                                node2Name: newEdgeNode2.name,
                                type: newEdgeType,
                                name: newEdgeName,
                            });
                            setNewEdgeName('');
                            setNewEdgeNode1(null);
                            setNewEdgeNode2(null);
                            setNewEdgeType(EDGE_TYPE_ENUM.SIMPLE);
                        }}>
                        <div>
                            {newEdgeNode1?.name}{' '}
                            <input
                                type="text"
                                value={newEdgeName}
                                onChange={(event) =>
                                    setNewEdgeName(event.target.value)
                                }
                            />
                            {''}
                            {newEdgeNode2?.name}
                        </div>
                        <button type="submit">Add Edge</button>
                    </form>
                    <h3>Edit Edge</h3>
                    <ul>
                        {edges.map((edge) => (
                            <li key={edge.id}>
                                {workingEdge?.id === edge.id ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (!workingEdge) return;
                                            editEdge(workingEdge.id, {
                                                ...workingEdge,
                                                name: editEdgeName,
                                                type: editEdgeType,
                                            });
                                            setWorkingEdge(null);
                                            setEditEdgeName('');
                                            setEditEdgeType(
                                                EDGE_TYPE_ENUM.SIMPLE
                                            );
                                        }}>
                                        <div>
                                            {workingEdge.node1Name}{' '}
                                            {editEdgeType ===
                                            EDGE_TYPE_ENUM.BOTH_WAYS
                                                ? '<='
                                                : '=='}
                                            <input
                                                type="text"
                                                value={editEdgeName}
                                                onChange={(event) =>
                                                    setEditEdgeName(
                                                        event.target.value
                                                    )
                                                }
                                            />
                                            {editEdgeType ===
                                                EDGE_TYPE_ENUM.A_TO_B ||
                                            editEdgeType ===
                                                EDGE_TYPE_ENUM.BOTH_WAYS
                                                ? '=>'
                                                : '=='}{' '}
                                            {workingEdge.node2Name}
                                        </div>
                                        <select
                                            onChange={(event) => {
                                                setEditEdgeType(
                                                    event.target
                                                        .value as unknown as EDGE_TYPE_ENUM
                                                );
                                            }}
                                            value={editEdgeType}>
                                            <option
                                                value={EDGE_TYPE_ENUM.SIMPLE}>
                                                Simple
                                            </option>
                                            <option
                                                value={EDGE_TYPE_ENUM.A_TO_B}>
                                                A to B
                                            </option>
                                            <option
                                                value={
                                                    EDGE_TYPE_ENUM.BOTH_WAYS
                                                }>
                                                Both Ways
                                            </option>
                                        </select>
                                        <button type="submit">Done</button>
                                    </form>
                                ) : (
                                    <>
                                        {edge.id}{' '}
                                        <button
                                            onClick={() => {
                                                setWorkingEdge(edge);
                                                setEditEdgeName(edge.name);
                                                setEditEdgeType(edge.type);
                                            }}>
                                            {parseEdgeName(edge)}
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        deleteEdge(edge.id);
                                    }}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
                <section>
                    <h2>Comments</h2>
                    <h3>New Comment</h3>
                    <h4>Choose a node</h4>
                    <select
                        onChange={(event) => {
                            console.log(event.target.value);

                            setNewCommentTargetNode(
                                nodes.find(
                                    (node) =>
                                        node.id.toString() ===
                                        event.target.value
                                ) || null
                            );
                            setNewCommentTargetEdge(null);
                        }}>
                        <option value={0}>--</option>
                        {nodes.map((node) => (
                            <option key={node.id} value={node.id}>
                                {node.name}
                            </option>
                        ))}
                    </select>
                    <h4>Or an edge</h4>
                    <select
                        onChange={(event) => {
                            setNewCommentTargetEdge(
                                edges.find(
                                    (edge) =>
                                        edge.id.toString() ===
                                        event.target.value
                                ) || null
                            );
                            setNewCommentTargetNode(null);
                        }}
                        value={newCommentTargetEdge?.id || 0}>
                        <option value={0}>--</option>
                        {edges.map((edge) => (
                            <option key={edge.id} value={edge.id}>
                                {parseEdgeName(edge)}
                            </option>
                        ))}
                    </select>
                    <h4>Write a comment</h4>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!newCommentText)
                                return console.log('No comment');
                            if (!newCommentTargetEdge && !newCommentTargetNode)
                                return console.log('No target');

                            addComment({
                                id: getNewId(),
                                text: newCommentText,
                                targetId:
                                    newCommentTargetEdge?.id ||
                                    newCommentTargetNode?.id ||
                                    0,
                                targetName:
                                    newCommentTargetEdge?.name ||
                                    newCommentTargetNode?.name ||
                                    '',
                            });
                            setNewCommentText('');
                        }}>
                        <label>
                            Text:
                            <input
                                type="text"
                                value={newCommentText}
                                onChange={(event) =>
                                    setNewCommentText(event.target.value)
                                }
                            />
                            <button type="submit">Save Comment</button>
                        </label>
                    </form>
                    <h3>Edit Comment</h3>
                    <ul>
                        {comments.map((comment) => (
                            <li key={comment.id}>
                                {workingComment?.id === comment.id ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (!workingComment) return;
                                            if (!editCommentText) return;
                                            editComment(workingComment.id, {
                                                ...workingComment,
                                                text: editCommentText,
                                            });
                                            setWorkingComment(null);
                                            setEditCommentText('');
                                        }}>
                                        <input
                                            type="text"
                                            value={editCommentText}
                                            onChange={(event) =>
                                                setEditCommentText(
                                                    event.target.value
                                                )
                                            }
                                        />
                                        <button type="submit">Done</button>
                                    </form>
                                ) : (
                                    <>
                                        <div>
                                            {comment.id}{' '}
                                            <strong>
                                                {comment.targetName}
                                            </strong>
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => {
                                                    setWorkingComment(comment);
                                                    setEditCommentText(
                                                        comment.text
                                                    );
                                                }}>
                                                <p>{comment.text}</p>
                                            </button>
                                        </div>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        deleteComment(comment.id);
                                    }}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            </main>
            <footer>
                <p>Nodes: {nodes.length}</p>
                <p>Edges: {edges.length}</p>
                <p>Comments: {comments.length}</p>
            </footer>
        </div>
    );
}
