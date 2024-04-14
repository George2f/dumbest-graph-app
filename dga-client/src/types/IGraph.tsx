import INode from './INode';
import ILink from './ILink';
import IComment from './IComment';
import IdType from './IdType';
import ITag from './ITag';

export default interface IGraph {
    graphId: IdType;
    name: string;
    loadGraph: (name: string) => void;
    getNewId: () => IdType;
    nodes: INode[];
    links: ILink[];
    comments: IComment[];
    tags: ITag[];
    initGraph: ({
        id,
        name,
        nodes,
        links,
        comments,
        tags,
    }: {
        id: IdType;
        name: string;
        nodes: INode[];
        links: ILink[];
        comments: IComment[];
        tags: ITag[];
    }) => void;
    clearGraph: () => void;
    addNode: (node: INode) => void;
    getNode(id: IdType): INode | undefined;
    editNode: (id: IdType, node: INode) => void;
    deleteNode: (id: IdType) => void;
    addComment: (comment: IComment) => void;
    getComment(id: IdType): IComment | undefined;
    editComment: (id: IdType, comment: IComment) => void;
    deleteComment: (id: IdType) => void;
    addLink: (link: ILink) => void;
    getLink(id: IdType): ILink | undefined;
    editLink: (id: IdType, link: ILink) => void;
    deleteLink: (id: IdType) => void;
    addTag: (tag: ITag) => void;
    getTag(id: IdType): ITag | undefined;
    editTag: (id: IdType, tag: ITag) => void;
    deleteTag: (id: IdType) => void;
}
