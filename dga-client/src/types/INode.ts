import IAttribute from './IAttribute';
import INamedGraphItem from './INamedGraphItem';
import IdType from './IdType';

export default interface INode extends INamedGraphItem {
    tags: IdType[];
    attributes?: IAttribute[];
}

export type NewNode = Omit<INode, 'id'>;
