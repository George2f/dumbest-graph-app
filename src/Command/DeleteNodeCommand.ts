import { IGraph } from '../providers/GraphProvider';
import IComment from '../types/IComment';
import ILink from '../types/ILink';
import INode from '../types/INode';
import AbstractCommand from './AbstractCommand';

export default class DeleteNodeCommand extends AbstractCommand {
    private graph: IGraph;
    private node: INode;
    private links: ILink[] = [];
    private comments: IComment[] = [];

    constructor(node: INode, graph: IGraph) {
        super();
        this.graph = graph;
        this.node = this.graph.nodes.find((n) => n.id === node.id)!;
    }

    public execute(): void {
        const links = this.graph.links.filter(
            (l) => l.node1Id === this.node.id || l.node2Id === this.node.id
        );

        const comments = this.graph.comments
            .filter((comment) => comment.targetId === this.node.id)
            .concat(
                this.graph.comments.filter((comment) =>
                    links.find((l) => l.id === comment.targetId)
                )
            );

        this.links = links;
        this.comments = comments;

        this.graph.deleteNode(this.node.id);
    }

    public undo(): void {
        this.graph.addNode(this.node);
        this.links.forEach((link) => {
            this.graph.addLink(link);
        });
        this.comments.forEach((comment) => {
            this.graph.addComment(comment);
        });
    }

    public getInfo(): string {
        return `Delete node ${this.node.id}`;
    }
}
