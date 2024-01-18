import NewLinkModule from '../../modules/link/NewLinkModule';
import LinkListModule from '../../modules/link/LinkListModule';
import NewNodeModule from '../../modules/node/NewNodeModule';
import NodeListModule from '../../modules/node/NodeListModule';
import NewTagModule from '../../modules/tag/NewTagModule';
import TagListModule from '../../modules/tag/TagListModule';
import { useState } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

export default function Dashboard() {
    const [isNodeModalOpen, setIsNodeModalOpen] = useState<boolean>(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState<boolean>(false);
    return (
        <main className="border-t-2 border-slate-400">
            <NewNodeModule />
            <NewLinkModule />
            <NewTagModule />
            <div className="grid grid-cols-2 grid-rows-2 gap-2 overflow-auto">
                <Button onClick={() => setIsNodeModalOpen(true)}>Nodes</Button>
                <Button onClick={() => setIsLinkModalOpen(true)}>Links</Button>

                <Button onClick={() => setIsTagModalOpen(true)}>Tags</Button>
            </div>
            <Modal
                isOpen={isNodeModalOpen}
                onDismiss={() => setIsNodeModalOpen(false)}>
                <div className="flex h-screen flex-col">
                    <div className="h-full overflow-y-auto">
                        <NodeListModule />
                    </div>
                    <Button
                        onClick={() => setIsNodeModalOpen(false)}
                        className="w-full">
                        Close
                    </Button>
                </div>
            </Modal>
            <Modal
                isOpen={isLinkModalOpen}
                onDismiss={() => setIsLinkModalOpen(false)}>
                <div className="flex h-screen flex-col">
                    <div className="h-full overflow-y-auto">
                        <LinkListModule />
                    </div>
                    <Button
                        onClick={() => setIsLinkModalOpen(false)}
                        className="w-full">
                        Close
                    </Button>
                </div>{' '}
            </Modal>
            <Modal
                isOpen={isTagModalOpen}
                onDismiss={() => setIsTagModalOpen(false)}>
                <div className="flex h-screen flex-col">
                    <div className="h-full overflow-y-auto">
                        <TagListModule />
                    </div>
                    <Button
                        onClick={() => setIsTagModalOpen(false)}
                        className="w-full">
                        Close
                    </Button>
                </div>{' '}
            </Modal>
        </main>
    );
}
