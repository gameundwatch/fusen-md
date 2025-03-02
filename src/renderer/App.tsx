import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';

import MainWindow from './MainWindow';
import NoteEditor from './NoteEditor';
import './App.css'

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
