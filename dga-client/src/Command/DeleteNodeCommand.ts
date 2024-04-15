import IComment from '../types/IComment';
import IGraph from '../types/IGraph';
import ILink from '../types/ILink';
import INode from '../types/INode';
import AbstractCommand from './AbstractCommand';

export default class DeleteNodeCommand extends AbstractCommand {
    private graph: IGraph;
    private node: INode;

    constructor(node: INode, graph: IGraph) {
        super();
        this.graph = graph;
        this.node = this.graph.nodes.find((n) => n.id === node.id)!;
    }

    public execute() {
        this.graph.deleteNode(this.node.id);
    }

    public undo() {
        this.graph.addNode(this.node);
    }

    public getInfo() {
        return `Delete node ${this.node.id}`;
    }
}
