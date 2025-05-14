// このファイルで window.electronAPI の型を宣言
export {};

declare global {
  interface Window {
    noteAPI: {
      getNotes(): Promise<any>;
      getNote(title: string): Promise<any>;
      addNote(title: string, content: string): Promise<any>;
      updateNote(title: string, content: string): Promise<any>;
      renameNote(title: string, newTitle: string): Promise<any>;
      deleteNote(title: string): Promise<any>;
      openNoteWindow(title: string): Promise<void>;
      closeNoteWindow(title: string): Promise<void>;
    };
  }
}
