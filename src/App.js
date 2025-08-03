import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/home';
import { useEffect, useLayoutEffect, useState } from 'react';
import LoginContext from './components/context/loginContext';
import axios from 'axios';
import ApiAddress from './ApiAddress';
import HomeLogged from './components/homeLogged/homeLogged';
import loggedUser from './components/context/loggedUserContext';

function App() {

  const [logged,setLogged] = useState(false)
  const [loggedUserState,setLoggedUserState] = useState({
    name:'',
    username:'',
    email:''
  })

  useEffect(()=>{
    console.log(logged)
  },[logged])

  const checkLogin = async()=>{
      const refreshToken = sessionStorage.getItem('refreshToken')
      if(refreshToken)
      {
        try
        {
          const response = await axios.post(`${ApiAddress}/refresh-token`,{token:refreshToken})
          const response2 = await axios.get(`${ApiAddress}/get-user-data`,{headers:{"Authorization":`Bearer ${response.data.token}`}})
          setLoggedUserState({name:response2.data.name,username:response2.data.username,email:response2.data.email})
          sessionStorage.setItem("token",response.data.token)
          setLogged(true)
        }
        catch(ex)
        {
          sessionStorage.removeItem('refreshToken')
          sessionStorage.removeItem('token')
        }
      }
      else
      {
        sessionStorage.removeItem('token')
      }
  }

  const setLoggedUserStateHandler = (data) =>
  {
    setLoggedUserState({name:data.name,username:data.username,email:data.email})
  }

  useEffect(()=>{
    checkLogin()
  },[])

  return (

    <LoginContext.Provider value={{logged,setLogged}}>
    <loggedUser.Provider value={{loggedUser:loggedUserState,setLoggedUser:setLoggedUserStateHandler}}>
    <Router>
      <Routes>
          <Route path='/' element={logged?<HomeLogged />:<Home />}/>
      </Routes>
    </Router>
    </loggedUser.Provider>
    </LoginContext.Provider>

  );
}

export default App;
