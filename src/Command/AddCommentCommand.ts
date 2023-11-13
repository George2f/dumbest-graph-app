import IComment from '../types/IComment';
import IGraph from '../types/IGraph';
import AbstractCommand from './AbstractCommand';

export default class AddCommentCommand extends AbstractCommand {
    private comment: IComment;
    private graph: IGraph;

    constructor(comment: IComment, graph: IGraph) {
        super();
        this.comment = comment;
        this.graph = graph;
    }

    public execute(): void {
        this.graph.addComment(this.comment);
    }

    public undo(): void {
        this.graph.deleteComment(this.comment.id);
    }

    public getInfo(): string {
        return `Add comment ${this.comment.id}`;
    }
}
