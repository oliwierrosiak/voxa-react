import { useEffect, useState } from 'react'
import styles from './topBar.module.css'
import Loading2 from '../../assets/svg/loading2'
import NoneUsers from '../../assets/svg/noneUsers'
import axios from 'axios'
import refreshToken from '../helpers/refreshToken'
import ApiAddress from '../../ApiAddress'
import UserImg from '../homeLogged/userImg'
import NotificationDate from './notificationData'
import { useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { socket } from '../../App'

function Notifications()
{

    const [notifications,setNotifications] = useState([])
    const [loading,setLoading] = useState(true)

    const navigate = useNavigate()
    const location = useLocation()

    const getNotifications = async()=>{
        setLoading(true)
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-my-notifications`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            setNotifications(response.data)
            setLoading(false)
        }
        catch(ex)
        {
            console.log(ex)
            setNotifications([])
            setLoading(false)
        }
    }

    const clearNotification = async(time) =>
    {
        try
        {
            await refreshToken()
            const response = await axios.patch(`${ApiAddress}/update-notifications`,{time},{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
        }
        catch(ex)
        {
            console.log(ex)
        }
    }

    const redirect = (destination,time) => {
        if(destination === "invitation" && location.pathname != '/invitations')
        {
            navigate('/invitations')
            clearNotification(time)
        }
    }

    useEffect(()=>{
        getNotifications()
        socket.on('notify',()=>{
            getNotifications()
        })
    },[])

    return(
        <div className={styles.notifications}>
            <span className={styles.triangle2}></span>
            <div className={styles.notificationsContent}>
                {loading?<div className={styles.notificationLoadingContainer}><Loading2 class={styles.notificationLoading}/></div>:(notifications.length>0?
                notifications.map(x=><div className={styles.notificationItem} onClick={e=>redirect(x.type,x.date)}>
                    <div className={styles.userImgContainer}>
                    <div className={styles.userImg}>
                        <UserImg img={x.img}/>
                    </div>
                    </div>
                    <h2 className={styles.notificationContent}>{x.content}</h2>
                    <p className={styles.date}><NotificationDate date={x.date}/></p>
                </div>)
                :<div className={styles.noneNotification}>
                <NoneUsers class={styles.noneUsersSVG} />
                <h2 className={styles.noneNotificationHeader}>Nie masz żadnych powiadomień</h2>
            </div>)}
            </div>
        </div>
    )
}

export default Notifications