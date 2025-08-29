import { act, useContext, useEffect, useRef, useState } from 'react'
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
import BinIcon from '../../assets/svg/bin'
import VoiceMessageIcon from '../../assets/svg/voiceMessage'
import VoiceMessage from './voiceMessage'
import MessageTime from './messageTime'
import GetVoiceMessage from './getVoiceMessage'
import GetPhotos from './getPohotos'
import Gallery from './gallery'
import File from './file'
import Message from './message'

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
    const [recording,setRecording] = useState(false)
    const [showGallery,setShowGallery] = useState(false)
    const [clickedPhoto,setClickedPhoto] = useState('')

    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const recordingIcon = useRef()
    const recordingAction = useRef('')

    const navigate = useNavigate()
    const logout = useContext(logoutContext)
    const params = useParams()
    const message = useContext(messageContext)
    const logged = useContext(loggedUser)

    const chatElement = useRef()
    const emoji = useRef()
    const header = useRef()
    const scrollHeader = useRef()

    const file = useRef()
    const photoRef = useRef()

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

    const sendVoiceMessage = async(mess)=>{
        try
        {
            setMessageLoading(true)
            const formData = new FormData
            formData.append('audio',mess,'voice.webm')
            formData.append('chatId',params.id)
            await refreshToken()
            const response = await axios.post(`${ApiAddress}/send-voice-message`,formData,{headers:{"Content-Type":"multipart/form-data","Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            setMessageLoading(false)
        }
        catch(ex)
        {
            message.setContent('Nie udało się wysłać wiadomości',"error")
             setMessageLoading(false)
        }
    }



    const stopRecording = (action) =>{
        if (recorderRef.current) {
            recordingAction.current = action
            recorderRef.current.stop();
        }
    }
    const recordVoice = async() =>{
        if(!recording && !messageLoading)
        {
            try
            {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const recorder = new MediaRecorder(stream);
                recorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                chunksRef.current.push(e.data);
                }
                };
        
                recorder.onstop = () => {
                    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                    chunksRef.current = [];
                    if(recordingAction.current === "send")
                    {
                        sendVoiceMessage(blob)
                    }
                    
                    setRecording(false)
                };

                recorder.start();
                setRecording(true)
                recorderRef.current = recorder;
            }
            catch(ex)
            {
                message.setContent("Wystąpił bład nagrywania","error")
                setRecording(false)
            }   
        }
        else
        {
            stopRecording('delete')
        }
    }

    const sendPhoto = async(e)=>{
        setMessageLoading(true)
        try
        {
            await refreshToken()
            const formData = new FormData()
            for(let i = 0;i<e.target.files.length;i++)
            {
                formData.append("images",e.target.files[i])
            }
            formData.append("chatId",params.id)
            const response = await axios.post(`${ApiAddress}/upload-chat-images`,formData,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`,"Content-Type":"multipart/form-data"}})
            setMessageLoading(false)
            e.target.value = ''

        }
        catch(ex)
        {
            if(ex.status === 404)
            {
                message.setContent('Nie właściwy typ pliku',"error")

            }
            else
            {
                message.setContent('Nie udało się wysłać zdjęcia',"error")

            }
            e.target.value = ''
            setMessageLoading(false)
        }
    }

    const galleryHandler = (clicked) =>{
        setShowGallery(true)
        setClickedPhoto(clicked)
    }

    const sendFile = async(e)=>
    {
        try
        {
            setMessageLoading(true)
            const sizeLong = e.target.files[0].size / (1024*1024)
            const size = Number(sizeLong.toFixed(2))
            if(size > 200)
            {
                setMessageLoading(false)
                message.setContent('Plik jest większy niż 200 MB',"error")
            }
            else
            {
                await refreshToken()
                const formData = new FormData()
                formData.append('file',e.target.files[0])
                formData.append("chatId",params.id)
                const response = await axios.post(`${ApiAddress}/upload-file`,formData,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
                setMessageLoading(false)
                e.target.value = ''
            }
        }
        catch(ex)
        {
            console.log(ex)
            setMessageLoading(false)
            message.setContent("Nie udało się wysłać pliku",'error')
            e.target.value = ''
        }
    }

    useEffect(()=>{
        let interval
        if(recording && recordingIcon.current)
        {
            interval = setInterval(()=>{
                recordingIcon.current.classList.toggle(styles.recordingIconAnimation)
            },700)
        }

        return () => {
            clearInterval(interval)
        }
    },[recording])

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

    const scrollFunc = () =>{
        if(chatElement.current)
        {
            chatElement.current.scrollTo(0,chatElement.current.scrollHeight)
        }
    }

    useEffect(()=>{
        scrollFunc()
        setShowGallery(false)
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
            {showGallery && <Gallery setShowGallery={setShowGallery} clickedPhoto={clickedPhoto} />}
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
                    {chat.map((x,idx)=><div key={x.time} className={`${styles.messageContainer} ${logged.loggedUser.id === x.sender?styles.myMessageContainer:null}`}>
                        {logged.loggedUser.id === x.sender?<div className={styles.messageStatusContainer}>
                            {x.status === "sent"?<SentArrowIcon class={styles.messageStatusSent} />:(checkSeenElement(idx)?<div className={styles.seenUserContainer}>
                                <UserImg img={user.img} />
                            </div>:null)}
                        </div>:<div className={styles.friendImgContainer}>
                            <UserImg img={user.img} />
                            </div>}
                        <div className={`${styles.message} ${logged.loggedUser.id === x.sender?styles.myMessage:null}`}>
                            {x.type === "voice"?<GetVoiceMessage file={x.message}/>:x.type === "photos" || x.type === "video"?<GetPhotos scrollFunc={scrollFunc} imgs={x.message} galleryHandler={galleryHandler}/>:x.type == "file"?<File file={x.message}/>:<Message message={x.message} />}
                        </div>
                        <div className={`${styles.date} ${logged.loggedUser.id === x.sender?styles.myMessageDate:null}`}>
                            {getMessageDate(x.time)}
                        </div>
                    </div>)}
                </div>
            )}
            {loading || chatError?null:
            user.username === "Unknown"?<div className={styles.chatDeleted}>Ten czat się zakończył ponieważ użytkownik usunął swoje konto</div>:
            <div className={styles.menu}>
                <div className={`${styles.recording} ${recording?styles.recordingShow:''}`}>
                    <div className={styles.recordingIconContainer}>
                        <div className={styles.recordingIcon} ref={recordingIcon}></div>
                    </div>
                    <div className={styles.messageTime}>
                        <MessageTime recording={recording}/>
                    </div>
                    <VoiceMessage />
                    <div className={styles.cancelVoiceMessage} onClick={e=>stopRecording('delete')}>
                        <BinIcon />
                    </div>
                </div>
                <div className={`${styles.bottomMenuIcon} ${styles.fileContainer}`} onClick={e=>{setDisplayEmoji(false);!messageLoading && file.current.click()}}>
                    <FileIcon class={styles.bottomMenuSVG}/>
                    <input type='file' className={styles.fileInput} ref={file} onChange={sendFile}/>
                </div>
                <div className={`${styles.bottomMenuIcon} ${styles.microphone}`} onClick={e=>{setDisplayEmoji(false);recordVoice()}}>
                    <MicrophoneIcon class={styles.bottomMenuSVG}/>
                    
                </div>
                <div className={`${styles.bottomMenuIcon} ${styles.photoIcon}`} onClick={e=>{setDisplayEmoji(false);!messageLoading && photoRef.current.click()}}>
                    <input type='file' className={styles.photoInput} ref={photoRef} accept='image/*,video/*' multiple onChange={sendPhoto}></input>
                    <PhotoIcon class={styles.bottomMenuSVG}/>
                </div>
                <div className={`${styles.inputContainer} ${inputFocus?styles.inputContainerFocus:''}`} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
                    <input type='text' className={styles.input} placeholder='Napisz wiadomość...' onFocus={e=>{e.target.placeholder='';setInputFocus(true);setDisplayEmoji(false)}} onBlur={e=>{e.target.placeholder='Napisz wiadomość...';setInputFocus(false)}} value={inputValue} onChange={e=>setInputValue(e.target.value)}/>
                    <div className={styles.inputIcon} onClick={e=>setDisplayEmoji(!displayEmoji)}>
                        <EmoteIcon class={styles.inputSVG}/>
                    </div>
                    <emoji-picker locale="pl" ref={emoji} className={`${styles.emojiPicker} ${displayEmoji?styles.displayEmoji:''}`}/>
                </div>
                <div className={styles.sentIcon} onClick={e=>{sentMessage();stopRecording("send")}}>
                    {messageLoading?<Loading2 class={styles.messageLoading}/>:
                    <SentIcon class={styles.bottomMenuSVG}/>}
                </div>
            </div>}
        </article>
    )
}

export default ChatContent