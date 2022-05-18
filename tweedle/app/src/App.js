import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {Provider as APIProvider} from './API';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <APIProvider>
      <BrowserRouter>
        <div className='md:grid md:grid-cols-12'>
          <div className='md:col-start-3 md:col-span-8 relative'>
            <Navbar />
            <Routes>
              <Route path='/' element={<Home />}/> 
              <Route path='leaderboard' element={<Leaderboard/>}/>
              <Route path='@:handle' element={<Profile />}/>
              <Route path="*" element={<NotFound />}/>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </APIProvider>
  );
}

export default App;
