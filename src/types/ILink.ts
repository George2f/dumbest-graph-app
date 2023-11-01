import LINK_TYPE_ENUM from './LinkTypeEnum';
import INamedGraphItem from './INamedGraphItem';
import IdType from './IdType';

export default interface ILink extends INamedGraphItem {
    node1Id: IdType;
    node1Name: string;
    node2Id: IdType;
    node2Name: string;
    type: LINK_TYPE_ENUM;
}
