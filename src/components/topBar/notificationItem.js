import styles from './topBar.module.css'
import UserImg from '../homeLogged/userImg'
import NotificationDate from './notificationData'
import { useEffect, useState } from 'react'
import axios from 'axios'
import refreshToken from '../helpers/refreshToken'
import ApiAddress from '../../ApiAddress'
function NotificationItem(props)
{
    const [seen,setSeen] = useState(props.x.seen)

    const changeSeen = async() => {
        try
        {
            if(!seen)
            {
                await refreshToken()
                const response = await axios.patch(`${ApiAddress}/modify-user-invitation`,{userId:props.x.userId,type:'seen'},{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
                setSeen(true)
            }
        }
        catch(ex)
        {
            setSeen(true)
        }
    }

    return(
        <div className={styles.notificationItem} onMouseOver={changeSeen} onClick={e=>props.redirect(props.x.type,props.x.date)}>
            <div className={styles.userImgContainer}>
                <div className={styles.userImg}>
                    <UserImg img={props.x.img}/>
                </div>
            </div>
            <h2 className={`${styles.notificationContent} ${!seen?styles.unSeen:''}`}>{props.x.content}</h2>
            <p className={`${styles.date} ${!seen?styles.unSeen:''}`}><NotificationDate date={props.x.date}/></p>
        </div>
    )
    
}

export default NotificationItem