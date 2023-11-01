import React from 'react';
import { useGraph } from '../providers/GraphProvider';
import INode from '../types/INode';
import ILink from '../types/ILink';
import IComment from '../types/IComment';
import LINK_TYPE_ENUM from '../types/LinkTypeEnum';
import parseLinkName from '../utils/parseLinkName';

export default function Graph() {
    const {
        nodes,
        links,
        comments,
        initGraph,
        addNode,
        addLink,
        addComment,
        editNode,
        editLink,
        editComment,
        deleteNode,
        deleteLink,
        deleteComment,
        getNewId,
    } = useGraph();

    const [newNodeName, setNewNodeName] = React.useState<string>('');

    const [workingNode, setWorkingNode] = React.useState<INode | null>(null);
    const [editNodeName, setEditNodeName] = React.useState<string>('');

    const [newCommentText, setNewCommentText] = React.useState<string>('');
    const [newCommentTargetNode, setNewCommentTargetNode] =
        React.useState<INode | null>(null);
    const [newCommentTargetLink, setNewCommentTargetLink] =
        React.useState<ILink | null>(null);

    const [workingComment, setWorkingComment] = React.useState<IComment | null>(
        null
    );
    const [editCommentText, setEditCommentText] = React.useState<string>('');

    const [newLinkName, setNewLinkName] = React.useState<string>('');
    const [newLinkType, setNewLinkType] = React.useState<LINK_TYPE_ENUM>(
        LINK_TYPE_ENUM.SIMPLE
    );
    const [newLinkNode1, setNewLinkNode1] = React.useState<INode | null>(null);
    const [newLinkNode2, setNewLinkNode2] = React.useState<INode | null>(null);

    const [workingLink, setWorkingLink] = React.useState<ILink | null>(null);
    const [editLinkName, setEditLinkName] = React.useState<string>('');
    const [editLinkType, setEditLinkType] = React.useState<LINK_TYPE_ENUM>(
        LINK_TYPE_ENUM.SIMPLE
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
                                JSON.stringify({
                                    nodes,
                                    links,
                                    comments,
                                })
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
                    <h2>Links</h2>
                    <h3>New Link</h3>
                    <h4>Choose a node</h4>
                    <select
                        onChange={(event) => {
                            setNewLinkNode1(
                                nodes.find(
                                    (node) =>
                                        node.id.toString() ===
                                        event.target.value
                                ) || null
                            );
                        }}
                        value={newLinkNode1?.id || 0}>
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
                            setNewLinkNode2(
                                nodes.find(
                                    (node) =>
                                        node.id.toString() ===
                                        event.target.value
                                ) || null
                            );
                        }}
                        value={newLinkNode2?.id || 0}>
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
                            setNewLinkType(
                                event.target.value as unknown as LINK_TYPE_ENUM
                            );
                        }}
                        value={newLinkType}>
                        <option value={LINK_TYPE_ENUM.SIMPLE}>Simple</option>
                        <option value={LINK_TYPE_ENUM.A_TO_B}>A to B</option>
                        <option value={LINK_TYPE_ENUM.BOTH_WAYS}>
                            Both Ways
                        </option>
                    </select>
                    <h4>
                        What do you call this relationship? (e.g. "is a friend")
                    </h4>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!newLinkNode1 || !newLinkNode2) return;
                            addLink({
                                id: getNewId(),
                                node1Id: newLinkNode1.id,
                                node1Name: newLinkNode1.name,
                                node2Id: newLinkNode2.id,
                                node2Name: newLinkNode2.name,
                                type: newLinkType,
                                name: newLinkName,
                            });
                            setNewLinkName('');
                            setNewLinkNode1(null);
                            setNewLinkNode2(null);
                            setNewLinkType(LINK_TYPE_ENUM.SIMPLE);
                        }}>
                        <div>
                            {newLinkNode1?.name}{' '}
                            <input
                                type="text"
                                value={newLinkName}
                                onChange={(event) =>
                                    setNewLinkName(event.target.value)
                                }
                            />
                            {''}
                            {newLinkNode2?.name}
                        </div>
                        <button type="submit">Add Link</button>
                    </form>
                    <h3>Edit Link</h3>
                    <ul>
                        {links.map((link) => (
                            <li key={link.id}>
                                {workingLink?.id === link.id ? (
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            if (!workingLink) return;
                                            editLink(workingLink.id, {
                                                ...workingLink,
                                                name: editLinkName,
                                                type: editLinkType,
                                            });
                                            setWorkingLink(null);
                                            setEditLinkName('');
                                            setEditLinkType(
                                                LINK_TYPE_ENUM.SIMPLE
                                            );
                                        }}>
                                        <div>
                                            {workingLink.node1Name}{' '}
                                            {editLinkType ===
                                            LINK_TYPE_ENUM.BOTH_WAYS
                                                ? '<='
                                                : '=='}
                                            <input
                                                type="text"
                                                value={editLinkName}
                                                onChange={(event) =>
                                                    setEditLinkName(
                                                        event.target.value
                                                    )
                                                }
                                            />
                                            {editLinkType ===
                                                LINK_TYPE_ENUM.A_TO_B ||
                                            editLinkType ===
                                                LINK_TYPE_ENUM.BOTH_WAYS
                                                ? '=>'
                                                : '=='}{' '}
                                            {workingLink.node2Name}
                                        </div>
                                        <select
                                            onChange={(event) => {
                                                setEditLinkType(
                                                    event.target
                                                        .value as unknown as LINK_TYPE_ENUM
                                                );
                                            }}
                                            value={editLinkType}>
                                            <option
                                                value={LINK_TYPE_ENUM.SIMPLE}>
                                                Simple
                                            </option>
                                            <option
                                                value={LINK_TYPE_ENUM.A_TO_B}>
                                                A to B
                                            </option>
                                            <option
                                                value={
                                                    LINK_TYPE_ENUM.BOTH_WAYS
                                                }>
                                                Both Ways
                                            </option>
                                        </select>
                                        <button type="submit">Done</button>
                                    </form>
                                ) : (
                                    <>
                                        {link.id}{' '}
                                        <button
                                            onClick={() => {
                                                setWorkingLink(link);
                                                setEditLinkName(link.name);
                                                setEditLinkType(link.type);
                                            }}>
                                            {parseLinkName(link)}
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        deleteLink(link.id);
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
                            setNewCommentTargetLink(null);
                        }}>
                        <option value={0}>--</option>
                        {nodes.map((node) => (
                            <option key={node.id} value={node.id}>
                                {node.name}
                            </option>
                        ))}
                    </select>
                    <h4>Or an link</h4>
                    <select
                        onChange={(event) => {
                            setNewCommentTargetLink(
                                links.find(
                                    (link) =>
                                        link.id.toString() ===
                                        event.target.value
                                ) || null
                            );
                            setNewCommentTargetNode(null);
                        }}
                        value={newCommentTargetLink?.id || 0}>
                        <option value={0}>--</option>
                        {links.map((link) => (
                            <option key={link.id} value={link.id}>
                                {parseLinkName(link)}
                            </option>
                        ))}
                    </select>
                    <h4>Write a comment</h4>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (!newCommentText)
                                return console.log('No comment');
                            if (!newCommentTargetLink && !newCommentTargetNode)
                                return console.log('No target');

                            addComment({
                                id: getNewId(),
                                text: newCommentText,
                                targetId:
                                    newCommentTargetLink?.id ||
                                    newCommentTargetNode?.id ||
                                    0,
                                targetName:
                                    newCommentTargetLink?.name ||
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
                <p>Links: {links.length}</p>
                <p>Comments: {comments.length}</p>
            </footer>
        </div>
    );
}
