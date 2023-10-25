import IGraphItem from './IGraphItem';
import IdType from './IdType';

export default interface IComment extends IGraphItem {
    targetId: IdType;
    targetName: string;
    text: string;
}
