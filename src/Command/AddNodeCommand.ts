import { IGraph } from '../providers/GraphProvider';
import INode from '../types/INode';
import AbstractCommand from './AbstractCommand';

export default class AddNodeCommand extends AbstractCommand {
    private node: INode;
    private graph: IGraph;

    constructor(node: INode, graph: IGraph) {
        super();
        this.node = node;
        this.graph = graph;
    }

    public execute(): void {
        this.graph.addNode(this.node);
    }

    public undo(): void {
        this.graph.deleteNode(this.node.id);
    }

    public getInfo(): string {
        return `Add node ${this.node.id}`;
    }
}
