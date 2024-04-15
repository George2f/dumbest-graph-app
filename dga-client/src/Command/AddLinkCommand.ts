import IGraph from '../types/IGraph';
import ILink, { NewLink } from '../types/ILink';
import AbstractCommand from './AbstractCommand';

export default class AddLinkCommand extends AbstractCommand {
    private newLink: NewLink;
    private createdLink: ILink | undefined;
    private graph: IGraph;

    constructor(link: NewLink, graph: IGraph) {
        super();
        this.newLink = link;
        this.graph = graph;
    }

    public execute() {
        if (this.createdLink) {
            this.graph.addLink(this.createdLink);
        } else {
            this.createdLink = this.graph.addLink(this.newLink);
        }
    }

    public undo() {
        if (!this.createdLink) {
            throw new Error('Cannot undo add link command');
        }
        this.graph.deleteLink(this.createdLink.id);
    }

    public getInfo(): string {
        return `Add link ${this.newLink.name}`;
    }
}
