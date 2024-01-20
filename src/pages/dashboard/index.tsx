import NewLinkModule from '../../modules/link/NewLinkModule';
import LinkListModule from '../../modules/link/LinkListModule';
import NewNodeModule from '../../modules/node/NewNodeModule';
import NodeListModule from '../../modules/node/NodeListModule';
import NewTagModule from '../../modules/tag/NewTagModule';
import TagListModule from '../../modules/tag/TagListModule';
import { useState } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';

interface IDashboardProps {
    children?: React.ReactNode;
}

export default function Dashboard({ children }: IDashboardProps) {
    const [isNewLinkModalOpen, setIsNewLinkModalOpen] =
        useState<boolean>(false);
    const [isNewNodeModalOpen, setIsNewNodeModalOpen] =
        useState<boolean>(false);
    const [isNewTagModalOpen, setIsNewTagModalOpen] = useState(false);

    const [isNodeModalOpen, setIsNodeModalOpen] = useState<boolean>(false);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState<boolean>(false);
    const [isTagModalOpen, setIsTagModalOpen] = useState<boolean>(false);

    return (
        <main className="border-t-2 border-slate-400">
            <Button onClick={() => setIsNewNodeModalOpen(true)}>
                New Node
            </Button>

            <Button onClick={() => setIsNewLinkModalOpen(true)}>
                New Link
            </Button>
            <Button
                onClick={() => {
                    setIsNewTagModalOpen(true);
                }}>
                New Tag
            </Button>

            <Button onClick={() => setIsNodeModalOpen(true)}>Nodes</Button>
            <Button onClick={() => setIsLinkModalOpen(true)}>Links</Button>

            <Button onClick={() => setIsTagModalOpen(true)}>Tags</Button>

            <Modal
                isOpen={isNewNodeModalOpen}
                onDismiss={() => setIsNewNodeModalOpen(false)}>
                <NewNodeModule />
            </Modal>

            <Modal
                isOpen={isNewLinkModalOpen}
                onDismiss={() => setIsNewLinkModalOpen(false)}>
                <NewLinkModule />
            </Modal>
            <Modal
                isOpen={isNewTagModalOpen}
                onDismiss={() => setIsNewTagModalOpen(false)}>
                <NewTagModule />
            </Modal>

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
                </div>
            </Modal>
            {children}
        </main>
    );
}
