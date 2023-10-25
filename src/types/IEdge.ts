import EDGE_TYPE_ENUM from './EdgeTypeEnum';
import INamedGraphItem from './INamedGraphItem';
import IdType from './IdType';

export default interface IEdge extends INamedGraphItem {
    node1Id: IdType;
    node1Name: string;
    node2Id: IdType;
    node2Name: string;
    type: EDGE_TYPE_ENUM;
}
