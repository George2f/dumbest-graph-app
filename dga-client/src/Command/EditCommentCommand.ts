import IComment from '../types/IComment';
import IGraph from '../types/IGraph';
import AbstractCommand from './AbstractCommand';

export default class EditCommentCommand extends AbstractCommand {
    private comment: IComment;
    private graph: IGraph;
    private oldComment: IComment | undefined;

    constructor(comment: IComment, graph: IGraph) {
        super();
        this.comment = comment;
        this.graph = graph;
    }

    public execute() {
        this.oldComment = this.graph.comments.find(
            (c) => c.id === this.comment.id
        )!;
        this.graph.updateComment(this.comment.id, this.comment);
    }

    public undo() {
        this.graph.updateComment(this.comment.id, this.oldComment!);
    }

    public getInfo() {
        return `Edit comment ${this.comment.id}`;
    }
}
