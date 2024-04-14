import GraphPersistenceContext from '../GraphPersistenceContext';
import IComment from '../../types/IComment';
import ILink from '../../types/ILink';
import INode from '../../types/INode';
import ITag from '../../types/ITag';
import IProviderProps from '../../providers/types/IProviderProps';

export default function SqliteStoragePersistenceProvider({
    children,
}: IProviderProps) {
    const handleClearGraph = () => {};

    const handleLoadGraph = ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id,
    }: {
        id: string;
    }):
        | { nodes: INode[]; links: ILink[]; comments: IComment[]; tags: ITag[] }
        | undefined => {
        return undefined;
    };

    const handleSaveGraph = ({
        id,
        graph,
    }: {
        id: string;
        graph: {
            nodes: INode[];
            links: ILink[];
            comments: IComment[];
            tags: ITag[];
        };
    }) => {
        return { id, graph };
    };

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
