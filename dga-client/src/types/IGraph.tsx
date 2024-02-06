import INode from './INode';
import ILink from './ILink';
import IComment from './IComment';
import IdType from './IdType';
import ITag from './ITag';

export default interface IGraph {
    graphId: string;
    setGraphId: (id: string) => void;
    getNewId: () => IdType;
    nodes: INode[];
    links: ILink[];
    comments: IComment[];
    tags: ITag[];
    initGraph: ({
        nodes,
        links,
        comments,
        tags,
    }: {
        nodes: INode[];
        links: ILink[];
        comments: IComment[];
        tags: ITag[];
    }) => void;
    clearGraph: () => void;
    addNode: (node: INode) => void;
    addComment: (comment: IComment) => void;
    addLink: (link: ILink) => void;
    deleteComment: (id: IdType) => void;
    deleteLink: (id: IdType) => void;
    deleteNode: (id: IdType) => void;
    editComment: (id: IdType, comment: IComment) => void;
    editLink: (id: IdType, link: ILink) => void;
    editNode: (id: IdType, node: INode) => void;
    addTag: (tag: ITag) => void;
    deleteTag: (id: IdType) => void;
    editTag: (id: IdType, tag: ITag) => void;
    getNode(id: IdType): INode | undefined;
    getLink(id: IdType): ILink | undefined;
    getComment(id: IdType): IComment | undefined;
    getTag(id: IdType): ITag | undefined;
}
