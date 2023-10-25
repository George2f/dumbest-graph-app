import EDGE_TYPE_ENUM from '../types/EdgeTypeEnum';
import IEdge from '../types/IEdge';

export default function parseEdgeName(edge: IEdge) {
    return (
        edge.node1Name +
        ' ' +
        (edge.type === EDGE_TYPE_ENUM.BOTH_WAYS ? '<=' : '==') +
        edge.name +
        (edge.type === EDGE_TYPE_ENUM.A_TO_B ||
        edge.type === EDGE_TYPE_ENUM.BOTH_WAYS
            ? '=>'
            : '==') +
        ' ' +
        edge.node2Name
    );
}
