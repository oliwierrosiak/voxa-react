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
import FileIcon from '../../assets/svg/file'
import MicrophoneIcon from '../../assets/svg/microphone'
import PhotoIcon from '../../assets/svg/photo'
import SentIcon from '../../assets/svg/sent'
import EmoteIcon from '../../assets/svg/emoteIcon'
import 'emoji-picker-element'
import { socket } from '../../App'
import messageContext from '../context/messageContext'
import sound from '../../assets/sound/message.mp3'
import loggedUser from '../context/loggedUserContext'
import getMessageDate from '../helpers/getMessageDate'
import SentArrowIcon from '../../assets/svg/sentArrow'
import sound2 from '../../assets/sound/seen.mp3'

function ChatContent(props)
{
    const [chat,setChat] = useState([])
    const [loading,setLoading] = useState(true)
    const [chatError,setChatError] = useState(false)
    const [user,setUser] = useState({})
    const [inputValue,setInputValue] = useState('')
    const [displayEmoji,setDisplayEmoji] = useState(false)
    const [messageLoading,setMessageLoading] = useState(false)
    const [inputFocus,setInputFocus] = useState(false)
    const [scrollHeaderDisplay,setScrollHeaderDisplay] = useState(false)

    const navigate = useNavigate()
    const logout = useContext(logoutContext)
    const params = useParams()
    const message = useContext(messageContext)
    const logged = useContext(loggedUser)

    const chatElement = useRef()
    const emoji = useRef()
    const header = useRef()
    const scrollHeader = useRef()

    const getChat = async() =>{
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-chat/${params.id}`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            setChat(response.data.chat)
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

    const sentMessage = async()=>{
        if(!messageLoading && inputValue.trim() != '')
        {
            setDisplayEmoji(false)
            try
            {   
                setMessageLoading(true)
                await refreshToken()
                const response = await axios.post(`${ApiAddress}/update-chat`,{chat:params.id,message:inputValue,time:new Date().getTime()},{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
                setInputValue('')
                setMessageLoading(false)
            }
            catch(ex)
            {
                message.setContent('Nie udało się wysłać wiadomości',"error")
                setMessageLoading(false)
            }
        }
        
    }

    const keyPressed = (e) =>{
        if(e.key === "Enter")
        {
            sentMessage()
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
            console.log(ex)
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

    useEffect(()=>{
        if(params.id)
        {
            socket.on('chatUpdate',socketUpdate)
            getChat()
            setDisplayEmoji(false)
            setInputValue('')
            messageSeen()
        }
        return()=>{
            socket.off('chatUpdate',socketUpdate)
        }
    },[params])

    const emojiClicked = (val) =>{
        const emoji = val.detail.unicode
        let value = inputValue+emoji
        setInputValue(value)
    }

    useEffect(()=>{
        if(chatElement.current)
        {
            chatElement.current.scrollTo(0,chatElement.current.scrollHeight)
        }
    },[chat])

    useEffect(()=>{
        window.addEventListener('keyup',keyPressed)
        if(emoji.current)
        {
            emoji.current.addEventListener("emoji-click",emojiClicked)

        }
        return ()=>{
            window.removeEventListener('keyup',keyPressed)
            if(emoji.current)
            {
                emoji.current.removeEventListener("emoji-click",emojiClicked)

            }
        }
    },[inputValue])

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

    const chatScroll = () =>{
        setScrollHeaderDisplay(header?.current?.getBoundingClientRect().top + header?.current?.clientHeight * 0.8 < 0)
    }

    useEffect(()=>{
        if(scrollHeaderDisplay)
        {
            setTimeout(() => {
                scrollHeader?.current?.classList.add(styles.scrollHeaderTransition)
            }, 50);
        }
        else
        {
            scrollHeader?.current?.classList.remove(styles.scrollHeaderTransition)
        }
    },[scrollHeaderDisplay])

    useEffect(()=>{
        chatScroll()
    },[])

    return(
        <article className={`${styles.chat} ${props.displayAside?styles.chatReduced:''}`}>
            {loading?<div className={styles.contentLoading}>
                <Loading2 class={styles.loadingSVG}/>
            </div>:(
                chatError?<div className={styles.chatError}>
                    <ErrorIcon />
                    <h2>Wystąpił błąd podczas pobierania czatu. Spróbuj ponownie później</h2>
                </div>:<div className={styles.chatContent} ref={chatElement} onScroll={chatScroll}>
                    <header className={styles.chatContentHeader} ref={header}>
                        <div className={styles.chatHeaderImg}>
                            <UserImg img={user.img} />
                        </div>
                        <h1>{user.username}</h1>
                        <p>To jest początek twojej konwersacji z tym użytkownikiem</p>
                    </header>
                    <header className={`${styles.scrollHeader} ${scrollHeaderDisplay?styles.scrollHeaderDisplay:''}`} ref={scrollHeader}>
                        <div className={styles.scrollHeaderImgContainer}>
                            <UserImg img={user.img} />
                        </div>
                        <h1 className={styles.scrollHeaderUsername}>{user.username}</h1>
                    </header>
                    {chat.map((x,idx)=><div className={`${styles.messageContainer} ${logged.loggedUser.id === x.sender?styles.myMessageContainer:null}`}>
                        {logged.loggedUser.id === x.sender?<div className={styles.messageStatusContainer}>
                            {x.status === "sent"?<SentArrowIcon class={styles.messageStatusSent} />:(checkSeenElement(idx)?<div className={styles.seenUserContainer}>
                                <UserImg img={user.img} />
                            </div>:null)}
                        </div>:<div className={styles.friendImgContainer}>
                            <UserImg img={user.img} />
                            </div>}
                        <div className={`${styles.message} ${logged.loggedUser.id === x.sender?styles.myMessage:null}`}>
                            {x.message}
                        </div>
                        <div className={`${styles.date} ${logged.loggedUser.id === x.sender?styles.myMessageDate:null}`}>
                            {getMessageDate(x.time)}
                        </div>
                    </div>)}
                </div>
            )}
            {loading || chatError?null:
            <div className={styles.menu}>
                <div className={styles.bottomMenuIcon} onClick={e=>setDisplayEmoji(false)}>
                    <FileIcon class={styles.bottomMenuSVG}/>
                </div>
                <div className={styles.bottomMenuIcon} onClick={e=>setDisplayEmoji(false)}>
                    <MicrophoneIcon class={styles.bottomMenuSVG}/>
                </div>
                <div className={styles.bottomMenuIcon} onClick={e=>setDisplayEmoji(false)}>
                    <PhotoIcon class={styles.bottomMenuSVG}/>
                </div>
                <div className={`${styles.inputContainer} ${inputFocus?styles.inputContainerFocus:''}`} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
                    <input type='text' className={styles.input} placeholder='Napisz wiadomość...' onFocus={e=>{e.target.placeholder='';setInputFocus(true);setDisplayEmoji(false)}} onBlur={e=>{e.target.placeholder='Napisz wiadomość...';setInputFocus(false)}} value={inputValue} onChange={e=>setInputValue(e.target.value)}/>
                    <div className={styles.inputIcon} onClick={e=>setDisplayEmoji(!displayEmoji)}>
                        <EmoteIcon class={styles.inputSVG}/>
                    </div>
                    <emoji-picker locale="pl" ref={emoji} className={`${styles.emojiPicker} ${displayEmoji?styles.displayEmoji:''}`}/>
                </div>
                <div className={styles.sentIcon} onClick={e=>{sentMessage()}}>
                    {messageLoading?<Loading2 class={styles.messageLoading}/>:
                    <SentIcon class={styles.bottomMenuSVG}/>}
                </div>
            </div>}
        </article>
    )
}

export default ChatContent