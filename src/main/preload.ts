// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);
contextBridge.exposeInMainWorld('electronAPI', {
  openNoteWindow: (title: string) =>
    ipcRenderer.invoke('open-note-window', title),
});

contextBridge.exposeInMainWorld('noteAPI', {
  // 全付箋取得
  getNotes: async () => {
    const notes = await ipcRenderer.invoke('get-notes');
    return notes;
  },
  // 単一取得
  getNote: async (title: string) => {
    const Note = await ipcRenderer.invoke('get-note', title);
    return Note;
  },
  addNote: async (title: string, content: string) => {
    const newNotes = await ipcRenderer.invoke('add-note', { title, content });
    return newNotes;
  },
  updateNote: async (title: string, content: string) => {
    const newNotes = await ipcRenderer.invoke('update-note', {
      title,
      content,
    });
    return newNotes;
  },
  renameNote: async (title: string, newTitle: string) => {
    const newNotes = await ipcRenderer.invoke('rename-note', title, newTitle);
    return newNotes;
  },
  deleteNote: async (title: string) => {
    const newNotes = await ipcRenderer.invoke('delete-note', title);
    return newNotes;
  },
  // 付箋ウィンドウを開く(必要なら)
  openNoteWindow: (title: string) => {
    ipcRenderer.invoke('open-note-window', title);
  },
  closeNoteWindow: (title: string) => {
    ipcRenderer.invoke('close-note-window', title);
  },
});
