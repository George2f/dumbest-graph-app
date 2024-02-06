import Button from './Button';
import Modal from './Modal';

interface IConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onDismiss: () => void;
    children?: React.ReactNode;
    confirmText?: string;
    dismissText?: string;
}

export default function ConfirmModal({
    isOpen,
    onConfirm,
    onDismiss,
    children,
    confirmText = 'Yes',
    dismissText = 'No',
}: IConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onDismiss={onDismiss}>
            <div>
                <div>{children}</div>
                <div className="grid grid-cols-2">
                    <Button onClick={onConfirm}>{confirmText}</Button>
                    <Button onClick={onDismiss}>{dismissText}</Button>
                </div>
            </div>
        </Modal>
    );
}
