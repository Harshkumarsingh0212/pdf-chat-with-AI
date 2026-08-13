import React, { useState } from 'react';
import api from './api'
import './App.css'
import FileForm from './components/FileForm';
import Conversation from './components/Conversation';

function App() {
  
  return (
    <div className='App'>
      <FileForm/>
      <Conversation/>
    </div>
  );
}

export default App;
