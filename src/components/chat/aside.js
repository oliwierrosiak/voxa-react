import { useContext, useEffect, useState, useRef } from 'react'
import ArrowIcon from '../../assets/svg/arrow'
import styles from './chat.module.css'
import Loading2 from '../../assets/svg/loading2'
import refreshToken from '../helpers/refreshToken'
import logoutContext from '../context/logoutContext'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import { useNavigate, useParams } from 'react-router-dom'
import AsideChatItem from './asideChatItem'
import messageContext from '../context/messageContext'
import UserImg from '../homeLogged/userImg'
import { socket } from '../../App'
function Aside(props)
{
    const message = useContext(messageContext)
    const [loading,setLoading] = useState(true)
    const [myChats,setMyChats] = useState([])
    const navigate = useNavigate()
    const params = useParams()
    const logout = useContext(logoutContext)
    const asideChatsContainer = useRef()

    const getMyChats = async()=>{
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-my-chats`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            setMyChats(response.data)
            setLoading(false)
        }
        catch(ex)
        {
            if(ex.status === 404)
            {
                navigate('/')
                message.setContent('Nie masz żadnych czatów',"error")
            }
            if(ex.status === 403)
            {
                logout.logout()
                navigate('/')
            }
        }
    }

    useEffect(()=>{
        if(!params.id && myChats[0]?.conversationId)
        {
            navigate(`/chats/${myChats[0].conversationId}`)
        }
    },[myChats,params.id])

    const redirect = (dest) =>{
        navigate(`/chats/${dest}`)
    }

    useEffect(()=>{
        getMyChats()
        socket.on('notify',(val)=>{
            if(val === "add")
            {
                asideChatsContainer?.current?.scrollTo(0,asideChatsContainer.scrollHeight)
                getMyChats()
            }
        })
        socket.on('chatUpdate',(arg)=>{
            asideChatsContainer?.current?.scrollTo(0,asideChatsContainer.scrollHeight)
            getMyChats()
        })
    },[])

    return(
        <aside className={`${styles.aside} ${props.displayAside?styles.displayAside:''}`}>
                {props.displayAside?<>
                <header className={styles.asideHeader}>
                    <div className={styles.menuIcon} onClick={e=>props.setDisplayAside(!props.displayAside)}>
                        <ArrowIcon class={styles.arrowSVG} />
                    </div>
                    <h1>Twoje Czaty</h1>
                </header>
                <div className={styles.asideChatsContainer} ref={asideChatsContainer}>
                {loading?<div className={styles.loadingContainer}><Loading2 class={styles.loadingSVG}/></div>:myChats.map(x=>
                    <AsideChatItem redirect={redirect} key={x._id} {...x} />
                )}
                </div>
                </>:<>
                    <div className={`${styles.menuIcon} ${styles.menuIcon2}`} onClick={e=>props.setDisplayAside(!props.displayAside)}>
                        <ArrowIcon class={styles.arrowSVG2} />
                    </div>
                    {loading?<div className={styles.loadingContainer}><Loading2 class={styles.loadingSVG}/></div>:<div className={styles.smallAsideChatsContainer}>{myChats.map(x=>
                        <div key={x._id} className={`${styles.smallAsideItem} ${params.id === x.conversationId?styles.currentChat:''}`} onClick={e=>redirect(x.conversationId)}>
                            <div className={styles.imgContainer2}>
                                <UserImg img={x.img} />
                                {x.seen !== "seen" && <div className={styles.hiddenAsideNewMessageAtChat}></div>}
                            </div>
                        </div>
                    )}</div>}
                </>}
        </aside>
    )
}

export default Aside