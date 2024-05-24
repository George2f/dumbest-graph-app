import IProviderProps from '../types/IProviderProps';
import LocalStoragePersistenceProvider from './LocalStoragePersistenceProvider';
import ServerPersistenceProvider from './ServerPersistenceProvider';
import SqlitePersistenceProvider from './SqlitePersistenceProvider';

interface IPersistenceProviderProps extends IProviderProps {
    persistenceType: 'local' | 'sqlite' | 'msw' | 'server';
}

export default function PersistenceProvider({
    persistenceType,
    children,
}: Readonly<IPersistenceProviderProps>) {
    switch (persistenceType) {
        case 'local':
            return (
                <LocalStoragePersistenceProvider>
                    {children}
                </LocalStoragePersistenceProvider>
            );
        case 'sqlite':
            return (
                <SqlitePersistenceProvider>
                    {children}
                </SqlitePersistenceProvider>
            );
        case 'msw':
        case 'server':
            return (
                <ServerPersistenceProvider>
                    {children}
                </ServerPersistenceProvider>
            );
        default:
            throw new Error(`Invalid persistence type: ${persistenceType}`);
    }
}
