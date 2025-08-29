import { useEffect, useRef, useState } from "react"
import Loading2 from "../../assets/svg/loading2"
import styles from './chat.module.css'
import refreshToken from "../helpers/refreshToken"
import axios from "axios"
import ApiAddress from "../../ApiAddress"
import PlayIcon from "../../assets/svg/play"
import StopIcon from "../../assets/svg/stopIcon"
import getMessageDuration from "../helpers/getMessageDuration"

function GetVoiceMessage(props)
{
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)
    const [playing,setPlaying] = useState(false)
    const [duration,setDuration] = useState(0)
    const [showDuration,setShowDuration] = useState(0)

    const audioRef = useRef(null)
    const timerRef = useRef(null)
    const timelineRef = useRef(null)

    const getDuration = async (blob) => {
        const arrayBuffer = await blob.arrayBuffer()
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
        return audioBuffer.duration*0.95
    }

    const getVoice = async()=>{
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-voice-message/${props.file}`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`},responseType:"blob"})
            const url = URL.createObjectURL(response.data)
            setDuration(await getDuration(response.data))
            const audio = new Audio(url)
            audioRef.current = audio
            setLoading(false)
        }
        catch(ex)
        {
            console.log(ex)
            setError(true)
            setLoading(false)
        }
    }

    const timelineContainerRef = useRef()

    const timelineClicked = (e) =>{
        const percent = (Math.abs(Math.round(Math.round(e.clientX - timelineContainerRef.current.getBoundingClientRect().left)/timelineContainerRef.current.clientWidth*100)))
        timelineRef.current.style.width = `${percent}%`
        const time = duration*(percent/100)
        audioRef.current.currentTime = time
    }

    useEffect(()=>{
        if(playing)
        {
            audioRef.current.play()
            timerRef.current = setInterval(()=>{
                if(audioRef.current.currentTime>=duration)
                {
                    audioRef.current.currentTime=0
                    clearInterval(timerRef.current)
                    setShowDuration(0)
                    setPlaying(false)
                }
                else
                {
                    setShowDuration(audioRef.current.currentTime)
                    const proportion = Math.ceil(audioRef.current.currentTime/duration*100)
                    if(timelineRef.current)
                    {
                        timelineRef.current.style.width = `${proportion}%`

                    }
                }
            },10)

        }
        else
        {
            audioRef?.current?.pause()
            clearInterval(timerRef?.current)
            if(timelineRef.current)
            {
                if( timelineRef.current.style.width === `100%`)
                {
                    timelineRef.current.style.width = `0%`

                }

            }


        }
    },[playing])

    useEffect(()=>{
        getVoice()
        return()=>{
            audioRef.current.pause()
            audioRef.current = null
            clearInterval(timerRef.current)
        }
    },[])

    return(
        <>
            {loading?<div className={styles.voiceMessageLoading}><Loading2 /></div>:(error?<p className={styles.voiceMessageError}>Błąd pobierania wiadomości</p>:<div className={styles.audio}>
                <div className={styles.play} onClick={e=>setPlaying(!playing)}>
                    {playing?
                    <StopIcon class={styles.playIcon} />
                    :
                    <PlayIcon class={styles.playIcon}/>}
                </div>
                <div className={styles.timelineContainer} onClick={timelineClicked} ref={timelineContainerRef}>
                    <div className={styles.timeline} ref={timelineRef}>
                        
                    </div>
                </div>
                <div className={styles.voiceMessageTime}>
                    {getMessageDuration(showDuration,duration)}
                </div>
            </div>)}
        </>
    )
}

export default GetVoiceMessage