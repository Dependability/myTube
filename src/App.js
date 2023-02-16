import Home from './components/Home';
import Upload from './components/Upload'
import {auth as realAuth, app} from './Firebase'; 
import {useAuthState} from 'react-firebase-hooks/auth'
import Layout from './components/Layout'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import SignUp from './components/SignUp'

function App() {
  
  const [user, loading] = useAuthState(realAuth)

  return (
    <BrowserRouter>
    <Routes>

      <Route path='/' element={<Home user={user}/>} ></Route>
      <Route path='/layout' element={<Layout />} ></Route>
      <Route path='/upload' element={<Upload user={user} loading= {loading}/>}></Route>
      <Route path='/sign-in' element={<SignUp user={user} ></SignUp>}> </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
