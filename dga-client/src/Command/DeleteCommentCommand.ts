import IComment from '../types/IComment';
import IGraph from '../types/IGraph';
import AbstractCommand from './AbstractCommand';

export default class DeleteCommentCommand extends AbstractCommand {
    private comment: IComment;
    private graph: IGraph;

    constructor(comment: IComment, graph: IGraph) {
        super();
        this.comment = comment;
        this.graph = graph;
    }

    public execute() {
        this.graph.deleteComment(this.comment.id);
    }

    public undo() {
        this.graph.addComment(this.comment);
    }

    public getInfo() {
        return `Delete comment ${this.comment.id}`;
    }
}
