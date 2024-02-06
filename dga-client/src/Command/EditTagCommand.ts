import IGraph from '../types/IGraph';
import ITag from '../types/ITag';
import IdType from '../types/IdType';
import AbstractCommand from './AbstractCommand';

export default class EditTagCommand extends AbstractCommand {
    private tagId: IdType;
    private graph: IGraph;
    private oldTag: ITag | undefined;
    private newTag: ITag;

    constructor(tagId: IdType, newTag: ITag, graph: IGraph) {
        super();
        this.tagId = tagId;
        this.graph = graph;
        this.newTag = newTag;
    }

    public execute(): void {
        this.oldTag = this.graph.getTag(this.tagId);
        this.graph.editTag(this.tagId, this.newTag);
    }

    public undo(): void {
        this.graph.editTag(this.tagId, this.oldTag!);
    }

    public getInfo(): string {
        return `Edit tag ${this.tagId}`;
    }
}
