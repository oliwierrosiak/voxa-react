import { useContext, useEffect } from 'react'
import styles from './homeLogged.module.css'
import UserImg from './userImg'
import getMessageDate from '../helpers/getMessageDate'
import { useNavigate } from 'react-router-dom'
import loggedUser from '../context/loggedUserContext'

function ChatElement(props)
{
    const navigate = useNavigate()
    const logged = useContext(loggedUser)

    const redirect = () =>{
        navigate(`/chats/${props.conversationId}`)
    }

    return(
        <div className={styles.chatElement} onClick={redirect}>
            <div className={styles.chatElementImgContainer}>
                <UserImg img={props.img} />
            </div>
            <h2 className={styles.chatElementUsername}>{props.username}</h2>
            <p className={`${styles.chatElementMessage} ${props.seen !== "seen"?styles.chatElementUnSeenYet:''}`}>{logged.loggedUser.id === props.sender?"Ty: ":''}{props.type === "voice"?"Wiadomość głosowa":props.type === "photos"?"Zdjęcie":props.message}</p>
            <div className={styles.date}>{props.seen === "seen"?getMessageDate(props.time):<div className={styles.newMessage}></div>}</div>
        </div>
    )
}

export default ChatElement