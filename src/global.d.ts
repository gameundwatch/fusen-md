// このファイルで window.electronAPI の型を宣言
export {};

declare global {
  interface Window {
    noteAPI: {
      getNotes(): Promise<any>;
      getNote(noteId: string): Promise<any>;
      addNote(title: string, content: string): Promise<any>;
      updateNote(id: string, title: string, content: string): Promise<any>;
      deleteNote(noteId: string): Promise<any>;
      openNoteWindow(noteId: string): Promise<void>;
      closeNoteWindow(noteId: string): Promise<void>;
    };
  }
}
