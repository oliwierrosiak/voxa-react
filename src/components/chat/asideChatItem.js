import { useEffect } from 'react'
import UserImg from '../homeLogged/userImg'
import styles from './chat.module.css'
import { useNavigate, useParams } from 'react-router-dom'

function AsideChatItem(props)
{
    const navigate = useNavigate()

    const params = useParams()

    return(
        <div className={`${styles.chatItem} ${params.id === props.conversationId?styles.currentChat:''}`} onClick={e=>props.redirect(props.conversationId)}>
            <div className={styles.imgContainer}>
                <UserImg img={props.img} />
            </div>
            <h2 className={styles.userName}>{props.username}</h2>
            <h3 className={`${styles.userMessage} ${props.seen === "seen"?styles.userMessageSeen:''}`}>{props.message}</h3>
        </div>
    )
}

export default AsideChatItem