import { createContext, useContext } from 'react';
import INode, { NewNode } from '../types/INode';
import ILink, { NewLink } from '../types/ILink';
import IComment, { NewComment } from '../types/IComment';
import ITag, { NewTag } from '../types/ITag';
import IdType from '../types/IdType';

interface IGraphPersistenceContextValue {
    createNode: ({
        graphId,
        node,
    }: {
        graphId: IdType;
        node: NewNode | INode;
    }) => INode;
    createLink: ({
        graphId,
        link,
    }: {
        graphId: IdType;
        link: NewLink | ILink;
    }) => ILink;
    createComment: ({
        graphId,
        comment,
    }: {
        graphId: IdType;
        comment: NewComment | IComment;
    }) => IComment;
    createTag: ({
        graphId,
        tag,
    }: {
        graphId: IdType;
        tag: NewTag | ITag;
    }) => ITag;
    updateNode: ({ graphId, node }: { graphId: IdType; node: INode }) => INode;
    updateLink: ({ graphId, link }: { graphId: IdType; link: ILink }) => ILink;
    updateComment: ({
        graphId,
        comment,
    }: {
        graphId: IdType;
        comment: IComment;
    }) => IComment;
    updateTag: ({ graphId, tag }: { graphId: IdType; tag: ITag }) => ITag;
    deleteNode: ({
        graphId,
        nodeId,
    }: {
        graphId: IdType;
        nodeId: IdType;
    }) => INode;
    deleteLink: ({
        graphId,
        linkId,
    }: {
        graphId: IdType;
        linkId: IdType;
    }) => ILink;
    deleteComment: ({
        graphId,
        commentId,
    }: {
        graphId: IdType;
        commentId: IdType;
    }) => IComment;
    deleteTag: ({ graphId, tagId }: { graphId: IdType; tagId: IdType }) => ITag;
    loadGraph: ({ name }: { name: string }) => {
        id: IdType;
        name: string;
        nodes: INode[];
        links: ILink[];
        comments: IComment[];
        tags: ITag[];
    };
    clearGraph: ({ id }: { id: IdType }) => void;
}

const GraphPersistenceContext =
    createContext<IGraphPersistenceContextValue | null>(null);

export default GraphPersistenceContext;

export function useGraphPersistence() {
    const context = useContext(GraphPersistenceContext);

    if (!context) {
        throw new Error(
            'useGraphPersistence must be used within a GraphPersistenceProvider'
        );
    }

    return context;
}
