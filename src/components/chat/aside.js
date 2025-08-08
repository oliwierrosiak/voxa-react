import { useContext, useEffect, useState } from 'react'
import ArrowIcon from '../../assets/svg/arrow'
import styles from './chat.module.css'
import Loading2 from '../../assets/svg/loading2'
import refreshToken from '../helpers/refreshToken'
import logoutContext from '../context/logoutContext'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import { useNavigate } from 'react-router-dom'
function Aside(props)
{
    const [loading,setLoading] = useState(true)
    const [myChats,setMyChats] = useState([])
    const navigate = useNavigate()
    const logout = useContext(logoutContext)
    const getMyChats = async()=>{
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-my-chats`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
        }
        catch(ex)
        {
            if(ex.status === 403)
            {
                logout.logout()
                // navigate('/')
            }
        }
    }

    useEffect(()=>{
        getMyChats()
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
                {loading?<div className={styles.loadingContainer}><Loading2 class={styles.loadingSVG}/></div>:myChats.map(x=>{

                })}
                </>:<>
                    <div className={styles.menuIcon} onClick={e=>props.setDisplayAside(!props.displayAside)}>
                        <ArrowIcon class={styles.arrowSVG2} />
                    </div>
                </>}
        </aside>
    )
}

export default Aside