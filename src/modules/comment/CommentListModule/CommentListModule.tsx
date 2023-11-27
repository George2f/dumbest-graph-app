import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import EditCommentCommand from '../../../Command/EditCommentCommand';
import DeleteCommentCommand from '../../../Command/DeleteCommentCommand';
import CommentListItem from './components/CommentListItem';

export default function CommentListModule() {
    const graph = useGraph();
    const history = useHistory();

    return (
        <>
            <h3>Comments</h3>
            <ul>
                {graph.comments.map((comment) => (
                    <li key={comment.id}>
                        <CommentListItem
                            comment={comment}
                            graph={graph}
                            onChange={(newComment) => {
                                const command = new EditCommentCommand(
                                    newComment,
                                    graph
                                );

                                command.execute();
                                history.push(command);
                            }}
                            onDelete={() => {
                                const command = new DeleteCommentCommand(
                                    comment,
                                    graph
                                );
                                command.execute();
                                history.push(command);
                            }}
                        />
                    </li>
                ))}
            </ul>
        </>
    );
}
