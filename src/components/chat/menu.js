import styles from './chat.module.css'
import BinIcon from '../../assets/svg/bin'
import VoiceMessage from './voiceMessage'
import MessageTime from './messageTime'
import FileIcon from '../../assets/svg/file'
import MicrophoneIcon from '../../assets/svg/microphone'
import PhotoIcon from '../../assets/svg/photo'
import SentIcon from '../../assets/svg/sent'
import EmoteIcon from '../../assets/svg/emoteIcon'
import { useState,useEffect,useRef, useContext } from 'react'
import { useParams } from 'react-router-dom'
import refreshToken from '../helpers/refreshToken'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import messageContext from '../context/messageContext'
import Loading2 from '../../assets/svg/loading2'

function Menu(props)
{
    const [recording,setRecording] = useState(false)
    const [inputFocus,setInputFocus] = useState(false)
    const [displayEmoji,setDisplayEmoji] = useState(false)
    const [inputValue,setInputValue] = useState('')

    const message = useContext(messageContext)

    const file = useRef()
    const photoRef = useRef()
    const params = useParams()
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const recordingIcon = useRef()
    const recordingAction = useRef('')
    const emoji = useRef()
    const textarea = useRef()

    const sendVoiceMessage = async(mess)=>{
        try
        {
            props.setMessageLoading(true)
            const formData = new FormData
            formData.append('audio',mess,'voice.webm')
            formData.append('chatId',params.id)
            await refreshToken()
            const response = await axios.post(`${ApiAddress}/send-voice-message`,formData,{headers:{"Content-Type":"multipart/form-data","Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            props.setMessageLoading(false)
        }
        catch(ex)
        {
            message.setContent('Nie udało się wysłać wiadomości',"error")
            props.setMessageLoading(false)
        }
    }

    const stopRecording = (action) =>{
        if (recorderRef.current) {
            recordingAction.current = action
            recorderRef.current.stop();
        }
    }

    const recordVoice = async() =>{
        if(!recording && !props.messageLoading)
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
        props.setMessageLoading(true)
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
            props.setMessageLoading(false)
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
            props.setMessageLoading(false)
        }
    }


    const sendFile = async(e)=>
    {
        try
        {
            props.setMessageLoading(true)
            const sizeLong = e.target.files[0].size / (1024*1024)
            const size = Number(sizeLong.toFixed(2))
            if(size > 200)
            {
                props.setMessageLoading(false)
                message.setContent('Plik jest większy niż 200 MB',"error")
            }
            else
            {
                await refreshToken()
                const formData = new FormData()
                formData.append('file',e.target.files[0])
                formData.append("chatId",params.id)
                const response = await axios.post(`${ApiAddress}/upload-file`,formData,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
                props.setMessageLoading(false)
                e.target.value = ''
            }
        }
        catch(ex)
        {
            props.setMessageLoading(false)
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

    const sentMessage = async()=>{
        if(!props.messageLoading && inputValue.trim() != '')
        {
            setDisplayEmoji(false)
            try
            {   
                props.setMessageLoading(true)
                await refreshToken()
                const response = await axios.post(`${ApiAddress}/update-chat`,{chat:params.id,message:inputValue,time:new Date().getTime()},{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
                setInputValue('')
                props.setMessageLoading(false)
            }
            catch(ex)
            {
                message.setContent('Nie udało się wysłać wiadomości',"error")
                props.setMessageLoading(false)
            }
        }
        
    }

    const emojiClicked = (val) =>{
        const emoji = val.detail.unicode
        let value = inputValue+emoji
        setInputValue(value)
    }

    const keyPressed = (e) =>{
        if(e.key === "Enter" && window.innerWidth > 425)
        {
            sentMessage()
        }
    }

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



    const textAreaResizeReset = () =>{
        if(window.innerWidth <= 425 && textarea.current)
        {
            textarea.current.style.height = "auto"; 
        }
    }

    const textAreaResize = (e) =>
    {
        e.target.style.height = "auto"; 
        e.target.style.height = e.target.scrollHeight + "px";
    }

    useEffect(()=>{
        if(params.id)
        {
            setDisplayEmoji(false)
            setInputValue('')
        }
    },[params])

    return(
        <div className={styles.menu}>
                <div className={`${styles.recording} ${recording?styles.recordingShow:''} ${inputFocus && window.innerWidth <= 425?styles.bottomMenuIconHide:''}`}>
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
                <div className={`${styles.bottomMenuIcon} ${styles.fileContainer} ${inputFocus && window.innerWidth <= 425?styles.bottomMenuIconHide:''}`} onClick={e=>{setDisplayEmoji(false);!props.messageLoading && file.current.click()}}>
                    <FileIcon class={styles.bottomMenuSVG}/>
                    <input type='file' className={styles.fileInput} ref={file} onChange={sendFile}/>
                </div>
                <div className={`${styles.bottomMenuIcon} ${styles.microphone} ${inputFocus && window.innerWidth <= 425?styles.bottomMenuIconHide:''}`} onClick={e=>{setDisplayEmoji(false);recordVoice()}}>
                    <MicrophoneIcon class={styles.bottomMenuSVG}/>
                    
                </div>
                <div className={`${styles.bottomMenuIcon} ${styles.photoIcon} ${inputFocus && window.innerWidth <= 425?styles.bottomMenuIconHide:''}`} onClick={e=>{setDisplayEmoji(false);!props.messageLoading && photoRef.current.click()}}>
                    <input type='file' className={styles.photoInput} ref={photoRef} accept='image/*,video/*' multiple onChange={sendPhoto}></input>
                    <PhotoIcon class={styles.bottomMenuSVG}/>
                </div>
                <div className={`${styles.inputContainer} ${inputFocus?styles.inputContainerFocus:''}`} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
                    {window.innerWidth > 425?<>
                    <input type='text' className={styles.input} placeholder='Napisz wiadomość...' onFocus={e=>{e.target.placeholder='';setInputFocus(true);setDisplayEmoji(false)}} onBlur={e=>{e.target.placeholder='Napisz wiadomość...';setInputFocus(false)}} value={inputValue} onChange={e=>setInputValue(e.target.value)}/>
                    <div className={styles.inputIcon} onClick={e=>setDisplayEmoji(!displayEmoji)}>
                        <EmoteIcon class={styles.inputSVG}/>
                    </div>
                    <emoji-picker locale="pl" ref={emoji} className={`${styles.emojiPicker} ${displayEmoji?styles.displayEmoji:''}`}/>
                    </>:<textarea ref={textarea} onInput={textAreaResize} className={styles.input} placeholder='Napisz wiadomość...' onFocus={e=>{e.target.placeholder='';setInputFocus(true)}} onBlur={e=>{e.target.placeholder='Napisz wiadomość...';setInputFocus(false)}} value={inputValue} onChange={e=>setInputValue(e.target.value)} rows="1"></textarea>}
                </div>
                <div className={styles.sentIcon} onClick={e=>{sentMessage();stopRecording("send");textAreaResizeReset()}}>
                    {props.messageLoading?<Loading2 class={styles.messageLoading}/>:
                    <SentIcon class={styles.bottomMenuSVG}/>}
                </div>
            </div>
    )
}
export default Menu