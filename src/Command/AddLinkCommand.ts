import IGraph from '../types/IGraph';
import ILink from '../types/ILink';
import AbstractCommand from './AbstractCommand';

export default class AddLinkCommand extends AbstractCommand {
    private link: ILink;
    private graph: IGraph;

    constructor(link: ILink, graph: IGraph) {
        super();
        this.link = link;
        this.graph = graph;
    }

    public execute(): void {
        this.graph.addLink(this.link);
    }

    public undo(): void {
        this.graph.deleteLink(this.link.id);
    }

    public getInfo(): string {
        return `Add link ${this.link.id}`;
    }
}
