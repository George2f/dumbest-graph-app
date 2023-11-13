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
        this.oldLink = graph.links.find((l) => l.id === link.id);
    }

    public execute(): void {
        this.graph.editLink(this.link.id, this.link);
    }

    public undo(): void {
        if (!this.oldLink) return;
        this.graph.editLink(this.oldLink.id, this.oldLink);
    }

    public getInfo(): string {
        return `Edit link ${this.link.id}`;
    }
}
