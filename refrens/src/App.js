import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cards from './Components/Cards';
import DisplayProfile from './Components/DisplayProfile';



function App() {
  return (
    <div className=''>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Cards />} />
          <Route path='/characters/:id' element={<DisplayProfile/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
