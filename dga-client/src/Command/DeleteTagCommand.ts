import IGraph from '../types/IGraph';
import INode from '../types/INode';
import ITag from '../types/ITag';
import AbstractCommand from './AbstractCommand';

export default class DeleteTagCommand extends AbstractCommand {
    private tag: ITag;
    private graph: IGraph;
    private nodes: INode[] = [];

    constructor(tag: ITag, graph: IGraph) {
        super();
        this.tag = tag;
        this.graph = graph;
    }

    public execute(): void {
        this.nodes = this.graph.nodes.filter((node) =>
            node.tags.includes(this.tag.id)
        );
        this.graph.deleteTag(this.tag.id);
    }

    public undo(): void {
        this.graph.addTag(this.tag!);
        this.nodes.forEach((node) => {
            this.graph.editNode(node.id, node);
        });
    }

    public getInfo(): string {
        return `Delete tag ${this.tag.id}`;
    }
}
