import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/home/home';
import { useEffect, useState } from 'react';
import LoginContext from './components/context/loginContext';
import axios from 'axios';
import ApiAddress from './ApiAddress';
import HomeLogged from './components/homeLogged/homeLogged';
import loggedUser from './components/context/loggedUserContext';
import messageContext from './components/context/messageContext';
import Message from './components/message/message';
import Invitations from './components/invitations/invitations';
import logoutContext from './components/context/logoutContext';
import io from 'socket.io-client'
import Chat from './components/chat/chat';
import Search from './components/searchPage/search';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Profile from './components/profile/profile';
import ResetPassword from './components/resetPassword/resetPassword';

export const socket = io(ApiAddress)

function App() {

  const [showLoginState,setShowLoginState] = useState('')
  const [logged,setLogged] = useState(false)
  const [loggedUserState,setLoggedUserState] = useState({
    name:'',
    username:'',
    email:'',
    id:''
  })
  const [message,setMessage] = useState({
    message:'',
    type:'',
  })

  const checkLogin = async()=>{
      const refreshToken = sessionStorage.getItem('refreshToken')
      if(refreshToken)
      {
        try
        {
          const response = await axios.post(`${ApiAddress}/refresh-token`,{token:refreshToken})
          const response2 = await axios.get(`${ApiAddress}/get-user-data`,{headers:{"Authorization":`Bearer ${response.data.token}`}})
          setLoggedUserState({name:response2.data.name,username:response2.data.username,email:response2.data.email,id:response2.data.id})
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
    setLoggedUserState({name:data.name,username:data.username,email:data.email,id:data.id})
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

  const logout = () =>{
     try
        {
            axios.post(`${ApiAddress}/logout`,{token:sessionStorage.getItem("refreshToken")})
        }
        catch(ex)
        {

        }
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('refreshToken')
        setLoggedUserState(false)
        setLogged(false)
        setShowLoginState('')
  }

  useEffect(()=>{
    checkLogin()
  },[])

  useEffect(()=>{
    if(logged && loggedUserState.email)
    {
      socket.emit('login',loggedUserState.email)
    }
  },[logged,loggedUserState])

  return (
    <GoogleOAuthProvider clientId='294845836411-uisma3kqknrvl4a1veghuvdt1j1dun1t.apps.googleusercontent.com'>
    <LoginContext.Provider value={{logged,setLogged}}>
    <loggedUser.Provider value={{loggedUser:loggedUserState,setLoggedUser:setLoggedUserStateHandler}}>
    <logoutContext.Provider value={{logout}}>
    <messageContext.Provider value={{content:message,setContent:setMessageContent}}>

    <Router>
      <Routes>
          <Route path='/' element={logged?<HomeLogged />:<Home showLoginState={showLoginState} setShowLoginState={setShowLoginState}/>}/>
          <Route path='/profile' element={<Profile />} />
          <Route path='/invitations' element={<Invitations />} />
          <Route path='/chats' element={<Chat />} />
          <Route path='/chats/:id' element={<Chat />}/>
          <Route path='/search/:search' element={<Search />} />
          <Route path='/reset-password/:token' element={<ResetPassword setShowLoginState={setShowLoginState}/>}/>
      </Routes>
    </Router>

    {message.message?<Message value={message}/>:null}

    </messageContext.Provider>
    </logoutContext.Provider>
    </loggedUser.Provider>
    </LoginContext.Provider>
    </GoogleOAuthProvider>
  );
}

export default App;
