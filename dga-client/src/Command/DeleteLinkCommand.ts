import IGraph from '../types/IGraph';
import ILink from '../types/ILink';
import AbstractCommand from './AbstractCommand';

export default class DeleteLinkCommand extends AbstractCommand {
    private link: ILink;
    private graph: IGraph;

    constructor(link: ILink, graph: IGraph) {
        super();
        this.link = link;
        this.graph = graph;
    }

    public execute() {
        this.graph.deleteLink(this.link.id);
    }

    public undo() {
        this.graph.addLink(this.link);
    }

    public getInfo() {
        return `Delete link ${this.link.id}`;
    }
}
