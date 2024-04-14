import { useCallback } from 'react';
import GraphPersistenceContext from '../GraphPersistenceContext';
import INode from '../../types/INode';
import ILink from '../../types/ILink';
import IComment from '../../types/IComment';
import ITag from '../../types/ITag';
import IProviderProps from '../../providers/types/IProviderProps';
import IdType from '../../types/IdType';

export default function LocalStoragePersistenceProvider({
    children,
}: IProviderProps) {
    const handleSaveGraph = useCallback(
        ({
            id,
            name,
            graph,
        }: {
            id: IdType;
            name: string;
            graph: {
                nodes: INode[];
                links: ILink[];
                comments: IComment[];
                tags: ITag[];
            };
        }) => {
            console.debug('Saving graph');
            const graphs = JSON.parse(localStorage.getItem('graphs') || '{}');
            graphs[id] = name;
            localStorage.setItem(id + '', JSON.stringify(graph));
            localStorage.setItem('graphs', JSON.stringify(graphs));
        },
        []
    );

    const handleLoadGraph = useCallback(({ name }: { name: string }) => {
        console.debug('Loading graph');
        const graphs = JSON.parse(localStorage.getItem('graphs') || '{}');
        const graphId = parseInt(
            Object.entries(graphs).find(
                ([, graphName]) => graphName === name
            )?.[0] || ''
        );

        if (graphId) {
            const graph = localStorage.getItem(graphId + '');
            const { nodes, links, comments, tags } = JSON.parse(graph || '{}');
            return {
                id: graphId,
                name,
                nodes: nodes || [],
                links: links || [],
                comments: comments || [],
                tags: tags || [],
            };
        }
        return undefined;
    }, []);

    const handleClearGraph = useCallback(({ id }: { id: IdType }) => {
        console.debug('Clearing graph');
        localStorage.removeItem(id + '');
        const graphs = JSON.parse(localStorage.getItem('graphs') || '{}');
        delete graphs[id];
        localStorage.setItem('graphs', JSON.stringify(graphs));
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
