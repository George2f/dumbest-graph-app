import LINK_TYPE_ENUM from './LinkTypeEnum';
import INamedGraphItem from './INamedGraphItem';
import IdType from './IdType';

export default interface ILink extends INamedGraphItem {
    node1Id: IdType;
    node2Id: IdType;
    type: LINK_TYPE_ENUM;
}

export type NewLink = Omit<ILink, 'id'>;
