import IGraph from '../types/IGraph';
import ITag from '../types/ITag';
import IdType from '../types/IdType';
import AbstractCommand from './AbstractCommand';

export default class DeleteTagCommand extends AbstractCommand {
    private tag: ITag;
    private graph: IGraph;
    private nodeIds: IdType[] = [];

    constructor(tag: ITag, graph: IGraph) {
        super();
        this.tag = tag;
        this.graph = graph;
    }

    public execute(): void {
        this.nodeIds = this.graph.nodes
            .filter((node) => node.tags.includes(this.tag.id))
            .map((node) => node.id);
        this.graph.deleteTag(this.tag.id);
    }

    public undo(): void {
        this.graph.addTag(this.tag!);
        this.nodeIds.forEach((nodeId) => {
            const node = this.graph.getNode(nodeId)!;
            this.graph.editNode(nodeId, {
                ...node,
                tags: [...node.tags, this.tag.id],
            });
        });
    }

    public getInfo(): string {
        return `Delete tag ${this.tag.id}`;
    }
}
