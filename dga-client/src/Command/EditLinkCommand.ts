import IGraph from '../types/IGraph';
import ILink from '../types/ILink';
import AbstractCommand from './AbstractCommand';

export default class EditLinkCommand extends AbstractCommand {
    private link: ILink;
    private graph: IGraph;
    private oldLink: ILink | undefined;

    constructor(link: ILink, graph: IGraph) {
        super();
        this.link = link;
        this.graph = graph;
    }

    public execute() {
        this.oldLink = this.graph.links.find((l) => l.id === this.link.id);
        this.graph.updateLink(this.link.id, this.link);
    }

    public undo() {
        this.graph.updateLink(this.link.id, this.oldLink!);
    }

    public getInfo() {
        return `Edit link ${this.link.id}`;
    }
}
