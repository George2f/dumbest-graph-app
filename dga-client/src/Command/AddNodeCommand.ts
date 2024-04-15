import IGraph from '../types/IGraph';
import INode, { NewNode } from '../types/INode';
import AbstractCommand from './AbstractCommand';

export default class AddNodeCommand extends AbstractCommand {
    private newNode: NewNode;
    private graph: IGraph;
    private createdNode: INode | undefined;

    constructor(node: NewNode, graph: IGraph) {
        super();
        this.newNode = node;
        this.graph = graph;
    }

    public execute() {
        if (this.createdNode) {
            this.graph.addNode(this.createdNode);
        } else {
            this.createdNode = this.graph.addNode(this.newNode);
        }
    }

    public undo() {
        if (!this.createdNode) {
            throw new Error('Cannot undo add node command');
        }
        this.graph.deleteNode(this.createdNode.id);
    }

    public getInfo() {
        return `Add node ${this.newNode.name}`;
    }
}
