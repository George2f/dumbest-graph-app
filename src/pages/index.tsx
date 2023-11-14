import { ReactNode } from 'react';
import HeaderModule from '../modules/HeaderModule';

export default function Root({ children }: { children: ReactNode }) {
    return (
        <>
            <div
                style={{
                    display: 'grid',
                    gridTemplateRows: 'auto 1fr auto',
                    height: 'calc(100vh - 16px)',
                    color: 'darkslategray',
                }}>
                <header>
                    <HeaderModule />
                </header>
                {children}
            </div>
        </>
    );
}
