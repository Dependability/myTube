import Home from './components/Home';
import Upload from './components/Upload'
import {auth as realAuth} from './Firebase'; 
import {useAuthState} from 'react-firebase-hooks/auth'
import Layout from './components/Layout'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './styles/styles.css';
import Video from './components/Video'
import Liked from './components/Liked';
import Channel from './components/Channel'
function App() {
  
  const [user, loading] = useAuthState(realAuth)

  return (
    <BrowserRouter>
    <Routes>

      <Route path='/' element={<Home user={user} loading={loading}/>} ></Route>
      <Route path='/layout' element={<Layout />} ></Route>
      <Route path='/upload' element={<Upload user={user} loading= {loading}/>}></Route>
      <Route path='/watch/:vidid' element={<Video user={user} loading={loading} />} />
      <Route path='/liked' element={<Liked user={user} loading={loading} />} />
      <Route path='/channel/:channelid' element={<Channel user={user} loading={loading} />} />
      <Route path='*' element={<Home user={user} loading={loading} />}> </Route>

    </Routes>
    </BrowserRouter>
  );
}

export default App;
