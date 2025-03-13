import { Routes, Route } from 'react-router-dom';

import { MainWindow } from './Components/MainWindow';
import NoteEditor from './Components/NoteEditor';
import './App.css';

export default function App() {
  return (
    <Routes>
      {/* トップページ("/") で メインウィンドウ表示 */}
      <Route path="/" element={<MainWindow />} />
      {/* サブウィンドウ用のURL("/note") で NoteEditor を表示 */}
      <Route path="/note" element={<NoteEditor />} />
    </Routes>
  );
}
