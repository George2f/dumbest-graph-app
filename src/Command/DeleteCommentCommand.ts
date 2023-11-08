import { IGraph } from '../providers/GraphProvider';
import IComment from '../types/IComment';
import AbstractCommand from './AbstractCommand';

export default class DeleteCommentCommand extends AbstractCommand {
    private comment: IComment;
    private graph: IGraph;

    constructor(comment: IComment, graph: IGraph) {
        super();
        this.comment = comment;
        this.graph = graph;
    }

    public execute(): void {
        this.graph.deleteComment(this.comment.id);
    }

    public undo(): void {
        this.graph.addComment(this.comment);
    }

    public getInfo(): string {
        return `Delete comment ${this.comment.id}`;
    }
}
