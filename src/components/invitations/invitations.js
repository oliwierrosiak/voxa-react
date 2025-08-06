import { useContext, useEffect, useState } from 'react'
import styles from './invitations.module.css'
import PageAuthorization from '../helpers/pageAuthorization'
import TopBar from '../topBar/topBar'
import refreshToken from '../helpers/refreshToken'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import Loading2 from '../../assets/svg/loading2'
import UserImg from '../homeLogged/userImg'
import EmptyIcon from '../../assets/svg/empty'
import logoutContext from '../context/logoutContext'
import messageContext from '../context/messageContext'


function Invitations(props)
{

    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(0)
    const [users,setUsers] = useState([])

    const logoutContextHandler = useContext(logoutContext)
    const message = useContext(messageContext)

    const getMyInvitations = async () =>
    {
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-my-invitations`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            setUsers(response.data)
            setLoading(false)
        }
        catch(ex)
        {
            if(ex.status === 404)
            {
                setError(ex.status)
                setLoading(false)

            }
            else
            {

                message.setContent('Wystapił bład serwera podczas pobierania zaproszeń',"error")
                logoutContextHandler.logout()
            }
        }
    }

    useEffect(()=>{
        getMyInvitations()
    },[])

    return(
        <>
        <TopBar />
            <PageAuthorization />
            <main className={styles.main}>
                {loading?<div className={styles.loadingContainer}><Loading2 /></div>:<>
                <h1 className={styles.header}>Twoje Zaproszenia</h1>
                    <div className={styles.usersContainer}>
                        {!error?(
                            users.map((x)=>{return <div className={styles.usersItem}>
                                <div className={styles.imgContainer}>
                                    <UserImg img={x.img} />
                                </div>   
                                <h2 className={styles.username}>{x.username}</h2>
                                <div className={styles.btnContainer}>
                                    <button className={`${styles.btn} ${styles.cancel}`}>Odrzuć</button>
                                    <button className={`${styles.btn} ${styles.accept}`}>Akceptuj</button>
                                </div>
                            </div>}))
                        :(error === 404?<div className={styles.emptyContainer}>
                            <div className={styles.emptySVGContainer}>
                                <EmptyIcon />
                            </div>
                            <h2 className={styles.error404Header}>Nie masz jak na razie żadnych zaproszeń</h2>
                        </div>:null)}
                    </div></>
                }
            </main>
        </>
    )
}

export default Invitations