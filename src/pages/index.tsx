import { ReactNode } from 'react';
import Header from '../components/Header';

export default function Root({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="flex flex-col">
                <Header />
                {children}
            </div>
        </>
    );
}
