import IComment, { NewComment } from '../types/IComment';
import IGraph from '../types/IGraph';
import AbstractCommand from './AbstractCommand';

export default class AddCommentCommand extends AbstractCommand {
    private newComment: NewComment;
    private createdComment: IComment | undefined;
    private graph: IGraph;

    constructor(comment: NewComment, graph: IGraph) {
        super();
        this.newComment = comment;
        this.graph = graph;
    }

    public async execute() {
        if (this.createdComment) {
            this.graph.addComment(this.createdComment);
        } else {
            this.createdComment = await this.graph.addComment(this.newComment);
        }
    }

    public undo() {
        if (!this.createdComment) {
            throw new Error('Cannot undo add comment command');
        }
        this.graph.deleteComment(this.createdComment.id);
    }

    public getInfo() {
        return `Add comment ${this.newComment.text}`;
    }
}
