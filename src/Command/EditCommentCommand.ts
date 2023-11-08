import { IGraph } from '../providers/GraphProvider';
import IComment from '../types/IComment';
import AbstractCommand from './AbstractCommand';

export default class EditCommentCommand extends AbstractCommand {
    private comment: IComment;
    private graph: IGraph;
    private oldComment: IComment;

    constructor(comment: IComment, graph: IGraph) {
        super();
        this.comment = comment;
        this.graph = graph;
        this.oldComment = graph.comments.find((c) => c.id === comment.id)!;
    }

    public execute(): void {
        this.graph.editComment(this.comment.id, this.comment);
    }

    public undo(): void {
        this.graph.editComment(this.oldComment.id, this.oldComment);
    }

    public getInfo(): string {
        return `Edit comment ${this.comment.id}`;
    }
}
