import { createContext, useContext } from 'react';
import INode from '../types/INode';
import ILink from '../types/ILink';
import IComment from '../types/IComment';
import ITag from '../types/ITag';

interface IGraphPersistenceContextValue {
    saveGraph: ({
        id,
        graph: { nodes, links, comments, tags },
    }: {
        id: string;
        graph: {
            nodes: INode[];
            links: ILink[];
            comments: IComment[];
            tags: ITag[];
        };
    }) => void;
    loadGraph: ({ id }: { id: string }) =>
        | {
              nodes: INode[];
              links: ILink[];
              comments: IComment[];
              tags: ITag[];
          }
        | undefined;
    clearGraph: ({ id }: { id: string }) => void;
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
