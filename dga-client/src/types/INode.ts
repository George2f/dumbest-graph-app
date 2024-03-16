import INamedGraphItem from './INamedGraphItem';
import IdType from './IdType';

export default interface INode extends INamedGraphItem {
    tags: IdType[];
    attributes?: [string, string][];
}
