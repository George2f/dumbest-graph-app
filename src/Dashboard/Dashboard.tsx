import React from 'react';
import { useGraph } from '../providers/GraphProvider';
import INode from '../types/INode';
import ILink from '../types/ILink';
import IComment from '../types/IComment';
import generateLinkName from '../utils/parseLinkName';
import { useHistory } from '../providers/HistoryProvider';
import AddCommentCommand from '../Command/AddCommentCommand';
import DeleteCommentCommand from '../Command/DeleteCommentCommand';
import EditCommentCommand from '../Command/EditCommentCommand';
import AddNodeCommand from '../Command/AddNodeCommand';
import EditNodeCommand from '../Command/EditNodeCommand';
import DeleteNodeCommand from '../Command/DeleteNodeCommand';
import NewLinkModule from '../modules/link/NewLinkModule';
import LinkListModule from '../modules/link/LinkListModule';

export default function Dashboard() {
    const graph = useGraph();
    const history = useHistory();

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

    const { nodes, links, comments, getNewId } = graph;

    return (
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
                        const command = new AddNodeCommand(
                            {
                                id: getNewId(),
                                name: newNodeName,
                            },
                            graph
                        );
                        command.execute();
                        history.push(command);

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

                                            const command = new EditNodeCommand(
                                                {
                                                    ...workingNode,
                                                    name: editNodeName,
                                                },
                                                graph
                                            );

                                            command.execute();
                                            history.push(command);

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
                                    <button
                                        onClick={() => {
                                            setWorkingNode(node);
                                            setEditNodeName(node.name);
                                        }}>
                                        {node.id} {node.name}
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => {
                                    const command = new DeleteNodeCommand(
                                        node,
                                        graph
                                    );

                                    command.execute();
                                    history.push(command);
                                }}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>Links</h2>
                <NewLinkModule />
                <LinkListModule />
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
                                    node.id.toString() === event.target.value
                            ) || null
                        );
                        setNewCommentTargetLink(null);
                    }}
                    value={newCommentTargetNode?.id || 0}>
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
                                    link.id.toString() === event.target.value
                            ) || null
                        );
                        setNewCommentTargetNode(null);
                    }}
                    value={newCommentTargetLink?.id || 0}>
                    <option value={0}>--</option>
                    {links.map((link) => (
                        <option key={link.id} value={link.id}>
                            {generateLinkName(link, '', '')}
                        </option>
                    ))}
                </select>
                <h4>Write a comment</h4>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!newCommentText) return console.log('No comment');
                        if (!newCommentTargetLink && !newCommentTargetNode)
                            return console.log('No target');

                        const command = new AddCommentCommand(
                            {
                                id: getNewId(),
                                text: newCommentText,
                                targetId:
                                    newCommentTargetLink?.id ||
                                    newCommentTargetNode?.id ||
                                    0,
                            },
                            graph
                        );

                        command.execute();
                        history.push(command);
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

                                        const command = new EditCommentCommand(
                                            {
                                                ...workingComment,
                                                text: editCommentText,
                                            },
                                            graph
                                        );

                                        command.execute();
                                        history.push(command);

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
                                            {
                                                (
                                                    graph.getNode(
                                                        comment.targetId
                                                    ) ||
                                                    graph.getLink(
                                                        comment.targetId
                                                    )
                                                )?.name
                                            }
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
                                    const command = new DeleteCommentCommand(
                                        comment,
                                        graph
                                    );
                                    command.execute();
                                    history.push(command);
                                }}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
