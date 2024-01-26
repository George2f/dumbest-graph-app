import { useCallback } from 'react';
import GraphPersistenceContext from '../../contexts/GraphPersistenceContext';
import INode from '../../types/INode';
import ILink from '../../types/ILink';
import IComment from '../../types/IComment';
import ITag from '../../types/ITag';

interface IGraphPersistenceProviderProps {
    children: React.ReactNode;
}

export default function LocalStoragePersistenceProvider({
    children,
}: IGraphPersistenceProviderProps) {
    const handleSaveGraph = useCallback(
        ({
            name,
            graph,
        }: {
            name: string;
            graph: {
                nodes: INode[];
                links: ILink[];
                comments: IComment[];
                tags: ITag[];
            };
        }) => {
            console.debug('Saving graph');
            localStorage.setItem(name, JSON.stringify(graph));
        },
        []
    );

    const handleLoadGraph = useCallback(({ name }: { name: string }) => {
        console.debug('Loading graph');
        const graph = localStorage.getItem(name);
        if (graph) {
            const { nodes, links, comments, tags } = JSON.parse(graph);
            return {
                nodes: nodes || [],
                links: links || [],
                comments: comments || [],
                tags: tags || [],
            };
        }
        return undefined;
    }, []);

    const handleClearGraph = useCallback(({ name }: { name: string }) => {
        console.debug('Clearing graph');
        localStorage.removeItem(name);
    }, []);

    return (
        <GraphPersistenceContext.Provider
            value={{
                clearGraph: handleClearGraph,
                loadGraph: handleLoadGraph,
                saveGraph: handleSaveGraph,
            }}>
            {children}
        </GraphPersistenceContext.Provider>
    );
}
