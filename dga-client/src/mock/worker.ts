import { setupWorker } from 'msw/browser';
import { createCommentMock } from '../persistence/ServerPersistenceProvider/utils/createComment';
import { clearGraphMock } from '../persistence/ServerPersistenceProvider/utils/clearGraph';
import { createLinkMock } from '../persistence/ServerPersistenceProvider/utils/createLink';
import { createNodeMock } from '../persistence/ServerPersistenceProvider/utils/createNode';
import { createTagMock } from '../persistence/ServerPersistenceProvider/utils/createTag';
import { deleteCommentMock } from '../persistence/ServerPersistenceProvider/utils/deleteComment';
import { deleteLinkMock } from '../persistence/ServerPersistenceProvider/utils/deleteLink';
import { deleteNodeMock } from '../persistence/ServerPersistenceProvider/utils/deleteNode';
import { deleteTagMock } from '../persistence/ServerPersistenceProvider/utils/deleteTag';
import { loadGraphMock } from '../persistence/ServerPersistenceProvider/utils/loadGraph';
import { updateCommentMock } from '../persistence/ServerPersistenceProvider/utils/updateComment';
import { updateLinkMock } from '../persistence/ServerPersistenceProvider/utils/updateLink';
import { updateNodeMock } from '../persistence/ServerPersistenceProvider/utils/updateNode';
import { updateTagMock } from '../persistence/ServerPersistenceProvider/utils/updateTag';

const worker = setupWorker(
    ...[
        clearGraphMock(),
        createCommentMock(),
        createLinkMock(),
        createNodeMock(),
        createTagMock(),
        deleteCommentMock(),
        deleteLinkMock(),
        deleteNodeMock(),
        deleteTagMock(),
        loadGraphMock(),
        updateCommentMock(),
        updateLinkMock(),
        updateNodeMock(),
        updateTagMock(),
    ]
);

export default worker;
