import styles from './chat.module.css'
import VoiceMessageIcon from '../../assets/svg/voiceMessage'
import { useEffect, useRef } from 'react'

function VoiceMessage(props)
{
    const voiceRef = useRef()

    useEffect(()=>{

        let interval
        if(voiceRef.current)
        {
             interval = setInterval(()=>{
                const children = [...voiceRef.current.children]
                children.forEach(x=>x.classList.toggle(styles.voiceAnimation))
            },1000)
        }

        return()=>{
            clearInterval(interval)
        }
    },[])

    return(
    <div className={styles.voice} ref={voiceRef}>
        <VoiceMessageIcon class={styles.voiceSVG}/>
        <VoiceMessageIcon class={styles.voiceSVG}/>
        <VoiceMessageIcon class={styles.voiceSVG}/>
        <VoiceMessageIcon class={styles.voiceSVG}/>
        <VoiceMessageIcon class={styles.voiceSVG}/>
        <VoiceMessageIcon class={styles.voiceSVG}/>
        <VoiceMessageIcon class={styles.voiceSVG}/>
        <VoiceMessageIcon class={styles.voiceSVG}/>

    </div>
    )
}

export default VoiceMessage