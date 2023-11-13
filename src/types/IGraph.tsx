import INode from './INode';
import ILink from './ILink';
import IComment from './IComment';
import IdType from './IdType';

export default interface IGraph {
    getNewId: () => IdType;
    nodes: INode[];
    links: ILink[];
    comments: IComment[];
    initGraph: ({
        nodes,
        links,
        comments,
    }: {
        nodes: INode[];
        links: ILink[];
        comments: IComment[];
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
    getNode(id: IdType): INode | undefined;
    getLink(id: IdType): ILink | undefined;
    getComment(id: IdType): IComment | undefined;
}
