import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/home';
import { useEffect, useLayoutEffect, useState } from 'react';
import LoginContext from './components/context/loginContext';
import axios from 'axios';
import ApiAddress from './ApiAddress';
import HomeLogged from './components/homeLogged/homeLogged';
import loggedUser from './components/context/loggedUserContext';
import messageContext from './components/context/messageContext';
import Message from './components/message/message';
import Invitations from './components/invitations/invitations';

function App() {

  const [logged,setLogged] = useState(false)
  const [loggedUserState,setLoggedUserState] = useState({
    name:'',
    username:'',
    email:''
  })
  const [message,setMessage] = useState({
    message:'',
    type:'',
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

  const setMessageContent = (value,type) =>
  {
    setMessage({
      message:'',
      type:''
    })
    setTimeout(() => {
      setMessage({
        message:value,
        type:type
      })
      
    }, 200);
  }

  useEffect(()=>{
    checkLogin()
  },[])

  return (

    <LoginContext.Provider value={{logged,setLogged}}>
    <loggedUser.Provider value={{loggedUser:loggedUserState,setLoggedUser:setLoggedUserStateHandler}}>
    <messageContext.Provider value={{content:message,setContent:setMessageContent}}>

    <Router>
      <Routes>
          <Route path='/' element={logged?<HomeLogged />:<Home />}/>
          <Route path='/invitations' element={<Invitations />} />
      </Routes>
    </Router>

    {message.message?<Message value={message}/>:null}

    </messageContext.Provider>
    </loggedUser.Provider>
    </LoginContext.Provider>

  );
}

export default App;
