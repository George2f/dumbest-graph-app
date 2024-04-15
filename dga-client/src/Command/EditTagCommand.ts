import IGraph from '../types/IGraph';
import ITag from '../types/ITag';
import AbstractCommand from './AbstractCommand';

export default class EditTagCommand extends AbstractCommand {
    private graph: IGraph;
    private oldTag: ITag | undefined;
    private tag: ITag;

    constructor(newTag: ITag, graph: IGraph) {
        super();
        this.graph = graph;
        this.tag = newTag;
    }

    public execute() {
        this.oldTag = this.graph.getTag(this.tag.id);
        this.graph.updateTag(this.tag.id, this.tag);
    }

    public undo() {
        this.graph.updateTag(this.tag.id, this.oldTag!);
    }

    public getInfo() {
        return `Edit tag ${this.tag.id}`;
    }
}
