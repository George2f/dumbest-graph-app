import IGraph from '../types/IGraph';
import INode from '../types/INode';
import AbstractCommand from './AbstractCommand';

export default class EditNodeCommand extends AbstractCommand {
    private node: INode;
    private graph: IGraph;
    private oldNode: INode | undefined;

    constructor(node: INode, graph: IGraph) {
        super();
        this.node = node;
        this.graph = graph;
    }

    public execute() {
        this.oldNode = this.graph.nodes.find((n) => n.id === this.node.id)!;
        this.graph.updateNode(this.node.id, this.node);
    }

    public undo() {
        this.graph.updateNode(this.node.id, this.oldNode!);
    }

    public getInfo() {
        return `Edit node ${this.node.id}`;
    }
}
