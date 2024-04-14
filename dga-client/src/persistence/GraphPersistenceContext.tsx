import { createContext, useContext } from 'react';
import INode from '../types/INode';
import ILink from '../types/ILink';
import IComment from '../types/IComment';
import ITag from '../types/ITag';
import IdType from '../types/IdType';

interface IGraphPersistenceContextValue {
    saveGraph: ({
        id,
        name,
        graph: { nodes, links, comments, tags },
    }: {
        id: IdType;
        name: string;
        graph: {
            nodes: INode[];
            links: ILink[];
            comments: IComment[];
            tags: ITag[];
        };
    }) => void;
    loadGraph: ({ name }: { name: string }) =>
        | {
              id: IdType;
              name: string;
              nodes: INode[];
              links: ILink[];
              comments: IComment[];
              tags: ITag[];
          }
        | undefined;
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
