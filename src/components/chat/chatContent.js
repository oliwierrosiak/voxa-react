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

function ChatContent(props)
{
    const [chat,setChat] = useState([])
    const [loading,setLoading] = useState(true)
    const [chatError,setChatError] = useState(false)
    const [user,setUser] = useState({})
    const [inputValue,setInputValue] = useState('')
    const [displayEmoji,setDisplayEmoji] = useState(false)

    const navigate = useNavigate()
    const logout = useContext(logoutContext)
    const params = useParams()

    const emoji = useRef()

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

    useEffect(()=>{
        if(params.id)
        {
            getChat()
            setDisplayEmoji(false)
            setInputValue('')
        }
    },[params])

    const emojiClicked = (val) =>{
        const emoji = val.detail.unicode
        let value = inputValue+emoji
        setInputValue(value)
    }

    useEffect(()=>{
        if(emoji.current)
        {
            emoji.current.addEventListener("emoji-click",emojiClicked)

        }
        return ()=>{
            if(emoji.current)
            {
                emoji.current.removeEventListener("emoji-click",emojiClicked)

            }
        }
    },[inputValue])

    return(
        <article className={`${styles.chat} ${props.displayAside?styles.chatReduced:''}`}>
            {loading?<div className={styles.contentLoading}>
                <Loading2 class={styles.loadingSVG}/>
            </div>:(
                chatError?<div className={styles.chatError}>
                    <ErrorIcon />
                    <h2>Wystąpił błąd podczas pobierania czatu. Spróbuj ponownie później</h2>
                </div>:<div className={styles.chatContent}>
                    <header className={styles.chatContentHeader}>
                        <div className={styles.chatHeaderImg}>
                            <UserImg img={user.img} />
                        </div>
                        <h1>{user.username}</h1>
                        <p>To jest początek twojej konwersacji z tym użytkownikiem</p>
                    </header>
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
                <div className={styles.inputContainer}>
                    <input type='text' className={styles.input} placeholder='Napisz wiadomość...' onFocus={e=>e.target.placeholder=''} onBlur={e=>e.target.placeholder='Napisz wiadomość...'} value={inputValue} onChange={e=>setInputValue(e.target.value)}/>
                    <div className={styles.inputIcon} onClick={e=>setDisplayEmoji(!displayEmoji)}>
                        <EmoteIcon class={styles.inputSVG}/>
                    </div>
                    <emoji-picker locale="pl" ref={emoji} className={`${styles.emojiPicker} ${displayEmoji?styles.displayEmoji:''}`}/>
                </div>
                <div className={styles.sentIcon} onClick={e=>setDisplayEmoji(false)}>
                    <SentIcon class={styles.bottomMenuSVG}/>
                </div>
            </div>}
        </article>
    )
}

export default ChatContent