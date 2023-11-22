import INamedGraphItem from './INamedGraphItem';
import IdType from './IdType';

export default interface INode extends INamedGraphItem {
    name: string;
    tags: IdType[];
}
