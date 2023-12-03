import { ReactNode } from 'react';

interface IModalProps {
    children: ReactNode;
    isOpen: boolean;
    onDismiss?: () => void;
}

export default function Modal({ children, isOpen, onDismiss }: IModalProps) {
    if (!isOpen) {
        return null;
    }
    return (
        <div className="fixed left-0 top-0 z-50 flex h-full w-full flex-row items-center justify-center">
            <button
                className="fixed left-0 top-0 z-0 h-full w-full bg-black opacity-20"
                onClick={onDismiss}></button>
            <div className="z-10 bg-slate-200 p-1 shadow-2xl">
                <div className="rounded-md bg-white p-1.5 shadow-inner">
                    {children}
                </div>
            </div>
        </div>
    );
}
