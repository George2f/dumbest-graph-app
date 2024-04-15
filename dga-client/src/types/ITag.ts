import INamedGraphItem from './INamedGraphItem';

export default interface ITag extends INamedGraphItem {
    color: string;
}

export type NewTag = Omit<ITag, 'id'>;
