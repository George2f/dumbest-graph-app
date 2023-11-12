import { IGraph } from '../providers/GraphProvider';
import INode from '../types/INode';
import AbstractCommand from './AbstractCommand';

export default class EditNodeCommand extends AbstractCommand {
    private node: INode;
    private graph: IGraph;
    private oldNode: INode;

    constructor(node: INode, graph: IGraph) {
        super();
        this.node = node;
        this.graph = graph;
        this.oldNode = graph.nodes.find((n) => n.id === node.id)!;
    }

    public execute(): void {
        this.graph.editNode(this.node.id, this.node);
    }

    public undo(): void {
        this.graph.editNode(this.node.id, this.oldNode);
    }

    public getInfo(): string {
        return `Edit node ${this.node.id}`;
    }
}
