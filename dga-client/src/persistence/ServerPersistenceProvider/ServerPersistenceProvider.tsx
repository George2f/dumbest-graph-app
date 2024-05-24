import { useMemo } from 'react';
import IProviderProps from '../../types/IProviderProps';
import GraphPersistenceContext from '../GraphPersistenceContext';
import createNode from './utils/createNode';
import createLink from './utils/createLink';
import createComment from './utils/createComment';
import createTag from './utils/createTag';
import updateNode from './utils/updateNode';
import updateLink from './utils/updateLink';
import updateComment from './utils/updateComment';
import updateTag from './utils/updateTag';
import deleteNode from './utils/deleteNode';
import deleteLink from './utils/deleteLink';
import deleteComment from './utils/deleteComment';
import deleteTag from './utils/deleteTag';
import loadGraph from './utils/loadGraph';
import clearGraph from './utils/clearGraph';

export default function ServerPersistenceProvider({
    children,
}: Readonly<IProviderProps>) {
    const value = useMemo(
        () => ({
            createNode,
            createLink,
            createComment,
            createTag,
            updateNode,
            updateLink,
            updateComment,
            updateTag,
            deleteNode,
            deleteLink,
            deleteComment,
            deleteTag,
            loadGraph,
            clearGraph,
        }),
        []
    );

    return (
        <GraphPersistenceContext.Provider value={value}>
            {children}
        </GraphPersistenceContext.Provider>
    );
}
