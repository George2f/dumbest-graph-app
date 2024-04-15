import INode, { NewNode } from './INode';
import ILink, { NewLink } from './ILink';
import IComment, { NewComment } from './IComment';
import IdType from './IdType';
import ITag, { NewTag } from './ITag';

export default interface IGraph {
    graphId: IdType;
    name: string;
    loadGraph: (name: string) => void;
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
    addNode: (node: NewNode | INode) => INode;
    getNode(id: IdType): INode | undefined;
    updateNode: (id: IdType, node: INode) => void;
    deleteNode: (id: IdType) => void;
    addComment: (comment: NewComment | IComment) => IComment;
    getComment(id: IdType): IComment | undefined;
    updateComment: (id: IdType, comment: IComment) => void;
    deleteComment: (id: IdType) => void;
    addLink: (link: NewLink | ILink) => ILink;
    getLink(id: IdType): ILink | undefined;
    updateLink: (id: IdType, link: ILink) => void;
    deleteLink: (id: IdType) => void;
    addTag: (tag: NewTag | ITag) => ITag;
    getTag(id: IdType): ITag | undefined;
    updateTag: (id: IdType, tag: ITag) => void;
    deleteTag: (id: IdType) => void;
}
