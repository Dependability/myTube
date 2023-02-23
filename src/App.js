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
  console.log(process.env)
  
  const [user, loading] = useAuthState(realAuth)
  return (
    <BrowserRouter>
    <Routes>

      <Route path={process.env.PUBLIC_URL + '/'} element={<Home user={user} loading={loading}/>} ></Route>
      <Route path={process.env.PUBLIC_URL + '/layout'} element={<Layout />} ></Route>
      <Route path={process.env.PUBLIC_URL + '/upload'} element={<Upload user={user} loading= {loading}/>}></Route>
      <Route path={process.env.PUBLIC_URL + '/watch/:vidid'} element={<Video user={user} loading={loading} />} />
      <Route path={process.env.PUBLIC_URL + '/liked'} element={<Liked user={user} loading={loading} />} />
      <Route path={process.env.PUBLIC_URL + '/channel/:channelid'} element={<Channel user={user} loading={loading} />} />
      <Route path={process.env.PUBLIC_URL + '/*'} element={<Home user={user} loading={loading} />}> </Route>

    </Routes>
    </BrowserRouter>
  );
}

export default App;
