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
  openNoteWindow: (noteId: string) =>
    ipcRenderer.invoke('open-note-window', noteId),
});

contextBridge.exposeInMainWorld('noteAPI', {
  // 全付箋取得
  getNotes: async () => {
    const notes = await ipcRenderer.invoke('get-notes');
    return notes;
  },
  // 単一取得
  getNote: async (noteId: string) => {
    const Note = await ipcRenderer.invoke('get-note-by-id', noteId);
    return Note;
  },
  // 追加
  addNote: async (title: string, content: string) => {
    // mainプロセス側で id を付加してくれる想定
    const newNote = await ipcRenderer.invoke('add-note', { title, content });
    return newNote;
  },
  // 更新
  updateNote: async (id: string, title: string, content: string) => {
    const updated = await ipcRenderer.invoke('update-note', {
      id,
      title,
      content,
    });
    return updated;
  },
  // 削除
  deleteNote: async (noteId: string) => {
    const success = await ipcRenderer.invoke('delete-note', noteId);
    return success;
  },
  // 付箋ウィンドウを開く(必要なら)
  openNoteWindow: (noteId: string) => {
    ipcRenderer.invoke('open-note-window', noteId);
  },
  closeNoteWindow: (noteId: string) => {
    ipcRenderer.invoke('close-note-window', noteId);
  },
});
