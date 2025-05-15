// electron/main.ts

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import Store from 'electron-store';

import { resolveHtmlPath } from './util';
import { Note } from '../common/note';

import { loadNotesFromDir } from './noteFiles/loadNoteFile';
import saveNoteFile from './noteFiles/saveNoteFile';
import deleteNoteFile from './noteFiles/deleteNoteFile';
import renameNoteFile from './noteFiles/renameNoteFile';

let notes: Note[] = [];

// 設定
const store = new Store({
  defaults: {
    windowBounds: { width: 800, height: 600 },
    theme: 'light',
  },
});
const rootDir = path.join(app.getPath('userData'), 'Notes');

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
            // symbolColor: '#fffa',
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

function createNoteWindow(title: string) {
  if (noteWindows.has(title)) {
    // 既にある場合はフォーカスを当てる
    noteWindows.get(title)?.focus();
    return;
  }

  const child = new BrowserWindow({
    width: 300,
    height: 200,
    transparent: true,
    frame: false,
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

  child.loadURL(`${resolveHtmlPath('index.html')}#/note?title=${title}`);
  child.webContents.openDevTools();
  child.on('closed', () => {
    noteWindows.delete(title);
  });

  if (process.platform === 'darwin') {
    // macOS
    child.setWindowButtonVisibility(false);
  }

  noteWindows.set(title, child);
}

function deleteNoteWindow(title: string) {
  noteWindows.get(title)?.close();
  noteWindows.delete(title);
}

app
  .whenReady()
  .then(async () => {
    // ファイルからMarkdownリストを生成
    console.log(`loading... ${rootDir}`);
    notes = await loadNotesFromDir(rootDir);

    createMainWindow();
    ipcMain.handle('open-note-window', (_evt, title: string) => {
      createNoteWindow(title);
    });
    ipcMain.handle('close-note-window', (_evt, title: string) => {
      deleteNoteWindow(title);
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

ipcMain.handle('get-note', async (_event, title: string) => {
  return notes.find((n) => n.title === title);
});

ipcMain.handle('add-note', async (_event, newNote: Note) => {
  // 受け取った newNote に id を付加して追加
  await saveNoteFile(newNote, rootDir);
  // ファイルの再スキャン
  notes = await loadNotesFromDir(rootDir);
  console.log(notes);
  return notes;
});

ipcMain.handle('update-note', async (_event, updatedNote: Note) => {
  // タイトルが一致するものを上書き
  try {
    await saveNoteFile(updatedNote, rootDir);
    notes = await loadNotesFromDir(rootDir);
    return notes;
  } catch (err) {
    console.error(err);
    return false;
  }
});

ipcMain.handle(
  'rename-note',
  async (_event, title: string, newTitle: string) => {
    // タイトルを変更
    try {
      const target = notes.find((n) => n.title === title);
      if (target) {
        await renameNoteFile(target, rootDir, newTitle);
        notes = await loadNotesFromDir(rootDir);
      }
      return notes; // 削除成功したかどうか
    } catch (err) {
      console.error(err);
      return false;
    }
  },
);

ipcMain.handle('delete-note', async (_event, title: string) => {
  try {
    const target = notes.find((n) => n.title === title);
    if (target) {
      await deleteNoteFile(target, rootDir);
      notes = await loadNotesFromDir(rootDir);
    }
    return notes; // 削除成功したかどうか
  } catch (err) {
    console.error(err);
    return false;
  }
});

ipcMain.handle('settings-get', (_, key) => store.get(key));
ipcMain.handle('settings-set', (_, key, val) => store.set(key, val));
