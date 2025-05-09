// electron/main.ts

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

import { resolveHtmlPath } from './util';
import { Note } from '../common/note';

import { loadNotesFromDir } from './noteFiles/loadNoteFile';
import saveNoteFile from './noteFiles/saveNoteFile';
import deleteNoteFile from './noteFiles/deleteNoteFile';

let notes: Note[] = [
  // { id: '1', title: 'Hello Fusen.md', content: '# Hello Fusen MD!' },
];

const rootDir = path.join('./', 'Notes');

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
    ...(process.platform !== 'darwin'
      ? {
          titleBarOverlay: {
            height: 32,
            color: '#fff0',
            symbolColor: '#fffa',
          },
        }
      : {}),
    trafficLightPosition: {
      x: 8,
      y: 8,
    },
  });
  // 開発中はローカルサーバ or ビルド後ファイルを読み込む
  mainWindow.loadURL(`${resolveHtmlPath('index.html')}#/`);
  mainWindow.webContents.openDevTools();
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
    transparent: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: true,
    },
    alwaysOnTop: true,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   height: 24,
    //   color: '#fff0',
    //   symbolColor: '#fffa'
    // },
  });

  child.loadURL(`${resolveHtmlPath('index.html')}#/note?noteId=${noteId}`);
  child.webContents.openDevTools();
  child.on('closed', () => {
    noteWindows.delete(noteId);
  });

  if (process.platform === 'darwin') {
    // macOS
    child.setWindowButtonVisibility(false);
  }

  noteWindows.set(noteId, child);
}

function deleteNoteWindow(noteId: string) {
  noteWindows.get(noteId)?.close();
  noteWindows.delete(noteId);
}

app
  .whenReady()
  .then(async () => {
    // ファイルからMarkdownリストを生成
    console.log(`loading... ${rootDir}`);
    notes = await loadNotesFromDir(rootDir);

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
  // アプリ有効化
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

ipcMain.handle('get-notes', () => {
  // 全付箋を返す
  return notes;
});

ipcMain.handle('get-note', async (_event, noteId: string) => {
  return notes.find((n) => n.id === noteId);
});

ipcMain.handle('add-note', async (_event, newNote: Omit<Note, 'id'>) => {
  // 受け取った newNote に id を付加して追加
  const id = newNote.title;
  const note: Note = { id, ...newNote };
  await saveNoteFile(note, rootDir);
  // ファイルの再スキャン
  notes = await loadNotesFromDir(rootDir);
  console.log(notes);
  return note;
});

ipcMain.handle('update-note', async (_event, updatedNote: Note) => {
  // IDが一致するものを上書き
  try {
    await saveNoteFile(updatedNote, './Notes');
    notes = await loadNotesFromDir(rootDir);
    return true;
    // const idx = notes.findIndex((n) => n.id === updatedNote.id);
    // if (idx >= 0) {

    //   // notes[idx] = updatedNote;
    //   return notes[idx];
    // }
  } catch (err) {
    console.error(err);
    return false;
  }
});

ipcMain.handle('delete-note', async (_event, noteId: string) => {
  const beforeLength = notes.length;
  const target = notes.find((n) => n.id === noteId);
  if (target) {
    // ファイルの消去
    deleteNoteFile(target, './Notes');
    notes = notes.filter((n) => n.id !== noteId);
  }
  return notes.length < beforeLength; // 削除成功したかどうか
});
