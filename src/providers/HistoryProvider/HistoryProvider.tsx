import React, { createContext } from 'react';
import AbstractCommand from '../../types/AbstractCommand';

interface IHistoryContextValue {
    getIndex: () => number;
    getLength: () => number;
    undo: () => void;
    redo: () => void;
    clear: () => void;
    push: (command: AbstractCommand) => void;
}

const HistoryContext = createContext<IHistoryContextValue>(
    {} as IHistoryContextValue
);

interface IHistoryProviderProps {
    children: React.ReactNode;
}

export default function HistoryProvider({ children }: IHistoryProviderProps) {
    const [history, setHistory] = React.useState<AbstractCommand[]>([]);
    const [index, setIndex] = React.useState<number>(-1);

    const getIndex = React.useCallback(() => {
        return index;
    }, [index]);

    const undo = React.useCallback(() => {
        if (index >= 0) {
            history[index].undo();
            setIndex(index - 1);
        }
    }, [history, index]);

    const redo = React.useCallback(() => {
        if (index < history.length - 1) {
            setIndex(index + 1);
            history[index + 1].execute();
        }
    }, [history, index]);

    const clear = React.useCallback(() => {
        setHistory([]);
        setIndex(-1);
    }, []);

    const push = React.useCallback(
        (command: AbstractCommand) => {
            const newHistory = history.slice(0, index + 1);
            newHistory.push(command);
            setHistory(newHistory);
            setIndex(index + 1);
        },
        [history, index]
    );

    return (
        <HistoryContext.Provider
            value={{
                getIndex,
                getLength: () => history.length,
                clear,
                push,
                redo,
                undo,
            }}>
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    return React.useContext(HistoryContext);
}
