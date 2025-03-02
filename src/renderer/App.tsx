import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';

import MainWindow from './MainWindow';
import NoteEditor from './NoteEditor';

export default function App() {
  return (
    <Theme accentColor="orange" appearance="light" radius="small">
      <Routes>
        {/* トップページ("/") で メインウィンドウ表示 */}
        <Route path="/" element={<MainWindow />} />
        {/* サブウィンドウ用のURL("/note") で NoteEditor を表示 */}
        <Route path="/note" element={<NoteEditor />} />
      </Routes>
    </Theme>
  );
}
