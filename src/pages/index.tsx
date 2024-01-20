import { ReactNode, useState } from 'react';
import Header from '../components/Header';
import NewElementFloater from '../components/NewElementFloater';
import Modal from '../components/Modal';
import NewNodeModule from '../modules/node/NewNodeModule';
import NewLinkModule from '../modules/link/NewLinkModule';
import NewTagModule from '../modules/tag/NewTagModule';

export default function Root({ children }: { children: ReactNode }) {
    const [isNewLinkModalOpen, setIsNewLinkModalOpen] =
        useState<boolean>(false);
    const [isNewNodeModalOpen, setIsNewNodeModalOpen] =
        useState<boolean>(false);
    const [isNewTagModalOpen, setIsNewTagModalOpen] = useState(false);

    return (
        <>
            <div className="flex h-full flex-col overflow-y-hidden">
                <Header />
                <NewElementFloater
                    onNewLinkClick={() => setIsNewLinkModalOpen(true)}
                    onNewNodeClick={() => setIsNewNodeModalOpen(true)}
                    onNewTagClick={() => setIsNewTagModalOpen(true)}
                />
                <div className="overflow-y-scroll">{children}</div>
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
            </div>
        </>
    );
}
