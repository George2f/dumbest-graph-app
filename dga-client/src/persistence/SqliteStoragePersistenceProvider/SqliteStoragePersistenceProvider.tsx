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

    const handleLoadGraph = ({ name }: { name: string }) => {
        return {
            id: 0,
            name: '',
            nodes: [],
            links: [],
            comments: [],
            tags: [],
        };
    };

    return (
        <GraphPersistenceContext.Provider
            value={{
                clearGraph: handleClearGraph,
                loadGraph: handleLoadGraph,
                createComment: () => ({}) as IComment,
                createLink: () => ({}) as ILink,
                createNode: () => ({}) as INode,
                createTag: () => ({}) as ITag,
                deleteComment: () => ({}) as IComment,
                deleteLink: () => ({}) as ILink,
                deleteNode: () => ({}) as INode,
                deleteTag: () => ({}) as ITag,
                updateComment: () => ({}) as IComment,
                updateLink: () => ({}) as ILink,
                updateNode: () => ({}) as INode,
                updateTag: () => ({}) as ITag,
            }}>
            {children}
        </GraphPersistenceContext.Provider>
    );
}
