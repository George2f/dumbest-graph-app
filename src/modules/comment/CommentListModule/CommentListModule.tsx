import { useState } from 'react';
import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import IComment from '../../../types/IComment';
import EditCommentCommand from '../../../Command/EditCommentCommand';
import DeleteCommentCommand from '../../../Command/DeleteCommentCommand';

export default function CommentListModule() {
    const graph = useGraph();
    const history = useHistory();

    const [workingComment, setWorkingComment] = useState<IComment | null>(null);
    const [editCommentText, setEditCommentText] = useState<string>('');

    return (
        <>
            <h3>Comments</h3>
            <ul>
                {graph.comments.map((comment) => (
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
                                        setEditCommentText(event.target.value)
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
                                                graph.getLink(comment.targetId)
                                            )?.name
                                        }
                                    </strong>
                                </div>
                                <div>
                                    <button
                                        onClick={() => {
                                            setWorkingComment(comment);
                                            setEditCommentText(comment.text);
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
        </>
    );
}
