import IGraph from '../types/IGraph';
import ITag from '../types/ITag';
import AbstractCommand from './AbstractCommand';

export default class AddTagCommand extends AbstractCommand {
    private tag: ITag;
    private graph: IGraph;

    constructor(tag: ITag, graph: IGraph) {
        super();
        this.tag = tag;
        this.graph = graph;
    }

    public execute(): void {
        this.graph.addTag(this.tag);
    }

    public undo(): void {
        this.graph.deleteTag(this.tag.id);
    }

    public getInfo(): string {
        return `Add tag ${this.tag.id}`;
    }
}
