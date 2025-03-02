// electron/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { resolveHtmlPath } from './util';

interface Note {
  id: string;
  title: string;
  content: string;
}

let notes: Note[] = [
  { id: '1', title: 'サンプル', content: '**Hello** from *Markdown*' },
];

// メインウィンドウやサブウィンドウを作るための変数
let mainWindow: BrowserWindow | null = null;
const noteWindows = new Map<string, BrowserWindow>();

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 320,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
  });
  // 開発中はローカルサーバ or ビルド後ファイルを読み込む
  mainWindow.loadURL(`${resolveHtmlPath('index.html')}#/`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createNoteWindow(noteId: string) {
  if (noteWindows.has(noteId)) {
    // 既にある場合はフォーカスを当てる
    noteWindows.get(noteId)?.focus();
    return;
  }

  const child = new BrowserWindow({
    width: 300,
    height: 200,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    alwaysOnTop: true,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    titleBarOverlay: true,
  });

  child.loadURL(`${resolveHtmlPath('index.html')}#/note?noteId=${noteId}`);
  child.on('closed', () => {
    noteWindows.delete(noteId);
  });
  noteWindows.set(noteId, child);
}

function deleteNoteWindow(noteId: string) {
  noteWindows.get(noteId)?.close();
  noteWindows.delete(noteId);
}

app
  .whenReady()
  .then(() => {
    createMainWindow();
    ipcMain.handle('open-note-window', (_evt, noteId: string) => {
      createNoteWindow(noteId);
    });
    ipcMain.handle('close-note-window', (_evt, noteId: string) => {
      deleteNoteWindow(noteId);
    });
    return console.log('Main Window created.');
  })
  .catch((e) => {
    console.log(e.message);
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

ipcMain.handle('get-notes', () => {
  // 全付箋を返す
  return notes;
});

ipcMain.handle('get-note-by-id', (_event, noteId: string) => {
  return notes.find((n) => n.id === noteId);
});

ipcMain.handle('add-note', (_event, newNote: Omit<Note, 'id'>) => {
  // 本来はID生成もメインプロセス側でする
  // ここでは受け取った newNote に id を付加して追加
  const id = Date.now().toString();
  const note: Note = { id, ...newNote };
  notes.push(note);
  return note;
});

ipcMain.handle('update-note', (_event, updatedNote: Note) => {
  // IDが一致するものを上書き
  const idx = notes.findIndex((n) => n.id === updatedNote.id);
  if (idx >= 0) {
    notes[idx] = updatedNote;
    return notes[idx];
  }
  return null; // 見つからなければ null
});

ipcMain.handle('delete-note', (_event, noteId: string) => {
  const beforeLength = notes.length;
  notes = notes.filter((n) => n.id !== noteId);
  return notes.length < beforeLength; // 削除成功したかどうか
});
