// electron/main.ts

import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs, { promises as fsPromises } from 'fs';
import { randomUUID } from 'crypto';

import { resolveHtmlPath } from './util';
import { Note } from '../common/note';

let notes: Note[] = [
  // { id: '1', title: 'Hello Fusen.md', content: '# Hello Fusen MD!' },
];

const dirPath = path.join('./', 'Notes');

// メインウィンドウやサブウィンドウを作るための変数
let mainWindow: BrowserWindow | null = null;
const noteWindows = new Map<string, BrowserWindow>();

// mdファイルの書き込み
function saveNoteAsMarkdown(note: Note, dir: string) {
  const notesDir = path.join(dir);

  // Notesディレクトリが存在しなければ作成
  if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true });
  }

  // ファイル名を安全にする（ファイル名として使えない文字の除去）
  const safeTitle = note.title.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
  const filePath = path.join(notesDir, `${safeTitle}.md`);

  // Markdownファイルの内容
  const markdownContent = `${note.content}`;

  // ファイル書き込み
  console.log(`saved: ${filePath}`);
  fs.writeFileSync(filePath, markdownContent, 'utf8');
}

async function loadNotesFromMarkdown(dir: string): Promise<Note[]> {
  // ディレクトリ確認
  if (!fs.existsSync(dir)) {
    await fsPromises.mkdir(dir, { recursive: true });
    return [];
  }

  const entries = await fsPromises.readdir(dir);
  const notesFromFiles: Note[] = [];

  entries.forEach(async (file) => {
    if (path.extname(file).toLowerCase() !== '.md') {
      return;
    }

    const filePath = path.join(dir, file);
    const content = await fsPromises.readFile(filePath, 'utf8');
    const title = path.basename(file, '.md');

    notesFromFiles.push({
      id: randomUUID(),
      title,
      content,
    });
  });

  return notesFromFiles;
}

async function deleteNoteAsMarkdown(note: Note, dir: string): Promise<boolean> {
  const fileName = `${note.title}.md`;
  const filePath = path.join(dir, fileName);
  console.log(filePath);
  // force=true: 無い場合もエラーにしない
  fs.promises.rm(filePath, { force: true });
  return true;
}

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
    console.log(`loading... ${dirPath}`);
    notes = await loadNotesFromMarkdown(dirPath);

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

ipcMain.handle('get-note-by-id', (_event, noteId: string) => {
  return notes.find((n) => n.id === noteId);
});

ipcMain.handle('add-note', (_event, newNote: Omit<Note, 'id'>) => {
  // 本来はID生成もメインプロセス側でする
  // ここでは受け取った newNote に id を付加して追加
  const id = randomUUID();
  const note: Note = { id, ...newNote };
  notes.push(note);
  // 初期ファイルを保存
  saveNoteAsMarkdown(note, './Notes');
  return note;
});

ipcMain.handle('update-note', async (_event, updatedNote: Note) => {
  // IDが一致するものを上書き
  const idx = notes.findIndex((n) => n.id === updatedNote.id);
  if (idx >= 0) {
    notes[idx] = updatedNote;
    saveNoteAsMarkdown(updatedNote, './Notes');
    return notes[idx];
  }
  return null; // 見つからなければ null
});

ipcMain.handle('delete-note', async (_event, noteId: string) => {
  const beforeLength = notes.length;
  const target = notes.find((n) => n.id === noteId);
  if (target) {
    // ファイルの消去
    deleteNoteAsMarkdown(target, './Notes');
    notes = notes.filter((n) => n.id !== noteId);
  }
  return notes.length < beforeLength; // 削除成功したかどうか
});
