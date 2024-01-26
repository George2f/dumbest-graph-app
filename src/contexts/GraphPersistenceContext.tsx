import { createContext, useContext } from 'react';
import INode from '../types/INode';
import ILink from '../types/ILink';
import IComment from '../types/IComment';
import ITag from '../types/ITag';

interface IGraphPersistenceContextValue {
    saveGraph: ({
        name,
        graph: { nodes, links, comments, tags },
    }: {
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
              nodes: INode[];
              links: ILink[];
              comments: IComment[];
              tags: ITag[];
          }
        | undefined;
    clearGraph: ({ name }: { name: string }) => void;
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
