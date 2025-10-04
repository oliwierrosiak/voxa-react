import { useContext, useEffect, useRef, useState } from 'react'
import styles from './chat.module.css'
import Loading2 from '../../assets/svg/loading2'
import refreshToken from '../helpers/refreshToken'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import { useParams, useNavigate } from 'react-router-dom'
import ErrorIcon from '../../assets/svg/error'
import logoutContext from '../context/logoutContext'
import UserImg from '../homeLogged/userImg'
import 'emoji-picker-element'
import { socket } from '../../App'
import sound from '../../assets/sound/message.mp3'
import loggedUser from '../context/loggedUserContext'
import getMessageDate from '../helpers/getMessageDate'
import SentArrowIcon from '../../assets/svg/sentArrow'
import sound2 from '../../assets/sound/seen.mp3'
import GetVoiceMessage from './getVoiceMessage'
import GetPhotos from './getPohotos'
import Gallery from './gallery'
import File from './file'
import Message from './message'
import ArrowIcon from '../../assets/svg/arrow'
import Menu from './menu'
import ScrollHeader from './scrollHeader'
import setDocumentTitle from '../helpers/useDocumentTitle'

function ChatContent(props)
{
    const [chat,setChat] = useState([])
    const [loading,setLoading] = useState(true)
    const [chatError,setChatError] = useState(false)
    const [user,setUser] = useState({})
    const [messageLoading,setMessageLoading] = useState(false)

    const [showGallery,setShowGallery] = useState(false)
    const [clickedPhoto,setClickedPhoto] = useState('')

    const navigate = useNavigate()
    const logout = useContext(logoutContext)
    const params = useParams()
    const logged = useContext(loggedUser)
    const chatElement = useRef()
    const header = useRef()
    
    let touchStart = 0
    let touchEnd = 0

    const getChat = async() =>{
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-chat/${params.id}`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            const chat = response.data.chat
            for(let i = chat.length-1; i>=0;i--)
            {
                if(typeof(chat[i].message) !== "string")
                {
                    chat[i].lastMedia = true
                    break
                }
            }
            setChat(chat)
            setUser(response.data.user)
            setLoading(false)
        }
        catch(ex)
        {
            if(ex.status === 403)
            {
                logout.logout()
                navigate('/')
            }
            else
            {
                setChatError(true)
                setLoading(false)

            }
        }
    }

    const messageSeen = async() =>{
        try
        {
            await refreshToken()
            const response = await axios.patch(`${ApiAddress}/message-seen`,{chatId:params.id},{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
        }
        catch(ex)
        {

        }
    }   

    const socketUpdate = (res) =>{

        const notify = new Audio(sound)
        const seenSound = new Audio(sound2)
        if(res.chat === params.id)
        {
            if(res.type === "new")
            {
                messageSeen()
                notify.play()
            }
            else if(res.type === "seen")
            {       
                seenSound.play()
            }
            getChat()
        }
        else
        {
            notify.play()
        }
    }

    const galleryHandler = (clicked) =>{
        setShowGallery(true)
        setClickedPhoto(clicked)
    }

    useEffect(()=>{
        if(params.id)
        {
            socket.on('chatUpdate',socketUpdate)
            getChat()
            messageSeen()
        }
        return()=>{
            socket.off('chatUpdate',socketUpdate)
        }
    },[params.id])

    const scrollFunc = () =>{
        if(chatElement.current)
        {
            chatElement.current.scrollTo(0,chatElement.current.scrollHeight)
        }
    }

    useEffect(()=>{
        setDocumentTitle(`Czat - ${user.username}`)
        sessionStorage.setItem("lastPage",`Czat - ${user.username}`)
        scrollFunc()
        setShowGallery(false)
    },[chat])

    const checkSeenElement = (idx) =>{

        const chatLocal = [...chat]
        const newArray = chatLocal.map(x=>{
            if(x.sender != logged.loggedUser.id)
            {
                return {}
            }
            else
            {
                if(x.status === "sent")
                {
                    return {}
                }
                else
                {
                    return x

                }
            }
        })
        const slicedArray = newArray.slice(idx+1)
        let empty = true
        slicedArray.forEach(x=>{
            if(x.status)
            {
                empty = false
            }
        })

        return empty
    }

    const touchEndFunc = (e) =>
    {
        touchEnd = e.changedTouches[0].clientX
        if(touchStart - touchEnd < -(window.innerWidth * 0.3) && window.innerWidth <= 425)
        {
            props.setDisplayAside(true)
        }
    }

    return(
        <article className={`${styles.chat} ${props.displayAside?styles.chatReduced:''}`} onTouchStart={e=>{touchStart = e.touches[0].clientX}} onTouchEnd={touchEndFunc}>
            {showGallery && <Gallery setShowGallery={setShowGallery} clickedPhoto={clickedPhoto} />}
            {loading?<div className={styles.contentLoading}>
                <Loading2 class={styles.loadingSVG}/>
            </div>:(
                chatError?<div className={styles.chatError}>
                    <ErrorIcon class={styles.errorIcon}/>
                    <h2>Wystąpił błąd podczas pobierania czatu. Spróbuj ponownie później</h2>
                </div>:<div className={styles.chatContent} ref={chatElement} id='chatContent'>
                    
                    <header className={styles.chatContentHeader} ref={header} id="chatHeader">
                        <div className={styles.responsiveArrow} onClick={e=>props.setDisplayAside(!props.displayAside)}>
                            <ArrowIcon class={styles.arrowSVG} />
                        </div>
                        <div className={styles.chatHeaderImg}>
                            <UserImg img={user.img} />
                        </div>
                        <h1>{user.username}</h1>
                        <p>To jest początek twojej konwersacji z tym użytkownikiem</p>
                    </header>
                    <ScrollHeader user={user} displayAside={props.displayAside} setDisplayAside={props.setDisplayAside}/>
                    {chat.map((x,idx)=><div key={Math.floor(Math.random()*1000000)} className={`${styles.messageContainer} ${logged.loggedUser.id === x.sender?styles.myMessageContainer:null}`}>
                        {logged.loggedUser.id === x.sender?<div className={styles.messageStatusContainer}>
                            {x.status === "sent"?<SentArrowIcon class={styles.messageStatusSent} />:(checkSeenElement(idx)?<div className={styles.seenUserContainer}>
                                <UserImg img={user.img} />
                            </div>:null)}
                        </div>:<div className={styles.friendImgContainer}>
                            <UserImg img={user.img} />
                            </div>}
                        <div className={`${styles.message} ${logged.loggedUser.id === x.sender?styles.myMessage:null}`}>
                            {x.type === "voice"?<GetVoiceMessage file={x.message}/>:x.type === "photos" || x.type === "video"?<GetPhotos scrollFunc={scrollFunc} imgs={x.message} lastMedia={x?.lastMedia} galleryHandler={galleryHandler}/>:x.type == "file"?<File file={x.message}/>:<Message message={x.message} />}
                        </div>
                        <div className={`${styles.date} ${logged.loggedUser.id === x.sender?styles.myMessageDate:null}`}>
                            {getMessageDate(x.time)}
                        </div>
                    </div>)}
                </div>
            )}
            {loading || chatError?null:
            user.username === "Unknown"?<div className={styles.chatDeleted}>Ten czat się zakończył ponieważ użytkownik usunął swoje konto</div>:
            <Menu setMessageLoading={setMessageLoading} messageLoading={messageLoading}/>}
        </article>
    )
}

export default ChatContent