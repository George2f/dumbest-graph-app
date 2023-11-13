import AbstractCommand from '../Command/AbstractCommand';


export default interface IHistory {
    getIndex: () => number;
    getLength: () => number;
    undo: () => void;
    redo: () => void;
    clear: () => void;
    push: (command: AbstractCommand) => void;
    getUndoInfo: () => string;
    getRedoInfo: () => string;
}
