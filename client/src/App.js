import {BrowserRouter, Routes, Route, Navigate, useNavigate} from 'react-router-dom'
import Homepage from './pages/Homepage';
import Chatpage from './pages/Chatpage';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage/>}/>
          <Route path='/chats' element={<Chatpage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
