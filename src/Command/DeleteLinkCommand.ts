import { IGraph } from '../providers/GraphProvider';
import IComment from '../types/IComment';
import ILink from '../types/ILink';
import AbstractCommand from './AbstractCommand';

export default class DeleteLinkCommand extends AbstractCommand {
    private link: ILink;
    private graph: IGraph;
    private comments: IComment[] = [];

    constructor(link: ILink, graph: IGraph) {
        super();
        this.link = link;
        this.graph = graph;
    }

    public execute(): void {
        this.comments = this.graph.comments.filter(
            (comment) => comment.targetId === this.link.id
        );
        this.graph.deleteLink(this.link.id);
    }

    public undo(): void {
        this.graph.addLink(this.link);
        this.comments.forEach((comment) => {
            this.graph.addComment(comment);
        });
    }

    public getInfo(): string {
        return `Delete link ${this.link.id}`;
    }
}
