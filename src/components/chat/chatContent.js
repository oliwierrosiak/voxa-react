import { useContext, useEffect, useState } from 'react'
import styles from './chat.module.css'
import Loading2 from '../../assets/svg/loading2'
import refreshToken from '../helpers/refreshToken'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import { useParams, useNavigate } from 'react-router-dom'
import ErrorIcon from '../../assets/svg/error'
import logoutContext from '../context/logoutContext'
import UserImg from '../homeLogged/userImg'

function ChatContent(props)
{
    const [chat,setChat] = useState([])
    const [loading,setLoading] = useState(true)
    const [chatError,setChatError] = useState(false)
    const [user,setUser] = useState({})


    const navigate = useNavigate()
    const logout = useContext(logoutContext)
    const params = useParams()

    const getChat = async() =>{
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-chat/${params.id}`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            setChat(response.data.chat)
            setUser(response.data.user)
            setLoading(false)
        }
        catch(ex)
        {
            if(ex.status === 403)
            {
                logout.logout()
                navigate('/')
            }
            else
            {
                setChatError(true)
                setLoading(false)

            }
        }
    }

    useEffect(()=>{
        console.log(user)
    },[user])

    useEffect(()=>{
        if(params.id)
        {
            getChat()
        }
    },[params])

    return(
        <article className={`${styles.chat} ${props.displayAside?styles.chatReduced:''}`}>
            {loading?<div className={styles.contentLoading}>
                <Loading2 class={styles.loadingSVG}/>
            </div>:(
                chatError?<div className={styles.chatError}>
                    <ErrorIcon />
                    <h2>Wystąpił błąd podczas pobierania czatu. Spróbuj ponownie później</h2>
                </div>:<div className={styles.chatContent}>
                    <header className={styles.chatContentHeader}>
                        <div className={styles.chatHeaderImg}>
                            <UserImg img={user.img} />
                        </div>
                        <h1>{user.username}</h1>
                        <p>To jest początek twojej konwersacji z tym użytkownikiem</p>
                    </header>
                </div>
            )}
            <div className={styles.menu}></div>
        </article>
    )
}

export default ChatContent