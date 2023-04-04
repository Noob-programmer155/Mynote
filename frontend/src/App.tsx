import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ViewTest from './view/view-test';
import View from './view/view';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<View/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
