import UserImg from '../homeLogged/userImg'
import styles from './chat.module.css'
import { useParams } from 'react-router-dom'
import getMessageDate from '../helpers/getMessageDate'

function AsideChatItem(props)
{

    const params = useParams()

    return(
        <div className={`${styles.chatItem} ${params.id === props.conversationId?styles.currentChat:''}`} onClick={e=>props.redirect(props.conversationId)}>
            <div className={styles.imgContainer}>
                <UserImg img={props.img} />
            </div>
            <h2 className={styles.userName}>{props.username}</h2>
            <h3 className={`${styles.userMessage} ${props.seen === "seen"?styles.userMessageSeen:''}`}>{props.type === "voice"?"Wiadomość głosowa":props.type === "photos"?"Zdjęcie":props.type === "video"?"Video":props.type === "file"?"Plik":props.message}</h3>
            <div className={styles.asideItemDate}>{props.seen === "seen"?getMessageDate(props.time):<div className={styles.newMessageAtChat}></div>}</div>
        </div>
    )
}

export default AsideChatItem