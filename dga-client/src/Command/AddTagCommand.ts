import IGraph from '../types/IGraph';
import ITag, { NewTag } from '../types/ITag';
import AbstractCommand from './AbstractCommand';

export default class AddTagCommand extends AbstractCommand {
    private newTag: NewTag;
    private createdTag: ITag | undefined;
    private graph: IGraph;

    constructor(tag: NewTag, graph: IGraph) {
        super();
        this.newTag = tag;
        this.graph = graph;
    }

    public async execute() {
        if (this.createdTag) {
            this.graph.addTag(this.createdTag);
        } else {
            this.createdTag = await this.graph.addTag(this.newTag);
        }
    }

    public undo() {
        if (!this.createdTag) {
            throw new Error('Cannot undo add tag command');
        }
        this.graph.deleteTag(this.createdTag.id);
    }

    public getInfo() {
        return `Add tag ${this.newTag.name}`;
    }
}
