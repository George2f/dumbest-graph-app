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
    }) => Promise<INode>;
    createLink: ({
        graphId,
        link,
    }: {
        graphId: IdType;
        link: NewLink | ILink;
    }) => Promise<ILink>;
    createComment: ({
        graphId,
        comment,
    }: {
        graphId: IdType;
        comment: NewComment | IComment;
    }) => Promise<IComment>;
    createTag: ({
        graphId,
        tag,
    }: {
        graphId: IdType;
        tag: NewTag | ITag;
    }) => Promise<ITag>;
    updateNode: ({
        graphId,
        node,
    }: {
        graphId: IdType;
        node: INode;
    }) => Promise<INode>;
    updateLink: ({
        graphId,
        link,
    }: {
        graphId: IdType;
        link: ILink;
    }) => Promise<ILink>;
    updateComment: ({
        graphId,
        comment,
    }: {
        graphId: IdType;
        comment: IComment;
    }) => Promise<IComment>;
    updateTag: ({
        graphId,
        tag,
    }: {
        graphId: IdType;
        tag: ITag;
    }) => Promise<ITag>;
    deleteNode: ({
        graphId,
        nodeId,
    }: {
        graphId: IdType;
        nodeId: IdType;
    }) => Promise<INode>;
    deleteLink: ({
        graphId,
        linkId,
    }: {
        graphId: IdType;
        linkId: IdType;
    }) => Promise<ILink>;
    deleteComment: ({
        graphId,
        commentId,
    }: {
        graphId: IdType;
        commentId: IdType;
    }) => Promise<IComment>;
    deleteTag: ({
        graphId,
        tagId,
    }: {
        graphId: IdType;
        tagId: IdType;
    }) => Promise<ITag>;
    loadGraph: ({ name }: { name: string }) => Promise<{
        id: IdType;
        name: string;
        nodes: INode[];
        links: ILink[];
        comments: IComment[];
        tags: ITag[];
    }>;
    clearGraph: ({ id }: { id: IdType }) => Promise<void>;
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
