import { useGraph } from '../../../providers/GraphProvider';
import { useHistory } from '../../../providers/HistoryProvider';
import EditCommentCommand from '../../../Command/EditCommentCommand';
import DeleteCommentCommand from '../../../Command/DeleteCommentCommand';
import CommentListItem from './components/CommentListItem';
import INode from '../../../types/INode';
import ILink from '../../../types/ILink';

interface ICommentListModuleProps {
    node?: INode;
    link?: ILink;
}

export default function CommentListModule({
    node,
    link,
}: ICommentListModuleProps) {
    const graph = useGraph();
    const history = useHistory();

    const comments = graph.comments.filter((comment) => {
        if (node) {
            return comment.targetId === node.id;
        }
        if (link) {
            return comment.targetId === link.id;
        }
        return true;
    });

    return (
        <>
            <h3>Comments</h3>
            <ul>
                {comments.map((comment) => (
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
