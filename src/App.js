import React from 'react';
import {Route, Routes} from 'react-router-dom';
import PostsPage from './components/PostsPage';

function App() {
  return (
    <Routes >
       <Route path="/" element={<PostsPage/>} />
    </Routes>
    
  );
}

export default App;