import { useContext, useEffect, useState } from 'react'
import Cancel from '../../assets/svg/cancel'
import ErrorIcon from '../../assets/svg/error'
import styles from './message.module.css'
import messageContext from '../context/messageContext'
import InfoIcon from '../../assets/svg/info'

function Message(props)
{
    const message = useContext(messageContext)
    const [display,setDisplay] = useState(false)
    const [progress,setProgress] = useState(false)

    let timeout1,timeout2,timeout3

    const closeMessage = () =>{
        setDisplay(false)
        setTimeout(() => {
            message.setContent('','')
        }, 500);
    }

    useEffect(()=>{
        timeout1 = setTimeout(() => {
            setDisplay(true)
            
        }, 50);
        timeout2 = setTimeout(() => {
            setProgress(true)
        }, 500);

        timeout3 = setTimeout(() => {
            closeMessage()
        }, 4700);
        return ()=>{
            clearTimeout(timeout1)
            clearTimeout(timeout2)
            clearTimeout(timeout3)
            clearTimeout(timeout3)
        }
    },[])

    return(
        <div className={`${styles.messageContainer} ${display?styles.messageContainerDisplay:''}`}>
            {props.value.type === "error"?<ErrorIcon class={styles.errorSVG}/>:props.value.type === "info"?<InfoIcon class={styles.errorSVG}/>:null}
            <h2>{props.value.message}</h2>
            <div className={styles.cancel} onClick={closeMessage}>
                <Cancel />
            </div>
        <div className={styles.progressBar}>
            <div className={`${styles.progressBarContent} ${progress?styles.progressBarContentFilled:''}`}></div>
        </div>
        </div>
    )
}

export default Message