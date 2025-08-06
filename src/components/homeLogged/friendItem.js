import styles from './homeLogged.module.css'
import UserImg from './userImg'
import PlusIcon from '../../assets/svg/plus'
import { useContext, useEffect, useRef, useState } from 'react'
import Loading2 from '../../assets/svg/loading2'
import refreshToken from '../helpers/refreshToken'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import OkIcon from '../../assets/svg/ok'
import messageContext from '../context/messageContext'

function FriendItem(props)
{
    const message = useContext(messageContext)
    const [loading,setLoading] = useState(false)

    const plus = useRef()

    const sendInvitation = async(id) =>{
        if(!loading)
        {
            setLoading(true)
            try
            {
                await refreshToken()
                const response = await axios.post(`${ApiAddress}/invitation`,{id:id},{headers:{'Authorization':`Bearer ${sessionStorage.getItem("token")}`}})
                if(response?.data?.info === "user already invited me")
                {
                    message.setContent('Ten użytkownik już cię zaprosił! Sprawdz zaproszenia.',"error")
                    setLoading(false)
                }
                else if(response?.data?.info === "user already invited")
                {
                    message.setContent('Już zaprosiłes tego użytkownika',"error")
                    setLoading(false)
                }
                else
                {
                    setLoading(false)
                    props.userItemClicked(props.item._id)
                    
                }
            }
            catch(ex)
            {
                message.setContent("Nie udało sie zaprosić użytkownika. Wystąpił bład serwera.","error")
                setLoading(false)
            }
            
        }
       
    }

    return(
        <div className={`${styles.friendsItem}`} onClick={e=>sendInvitation(props.item._id)} onMouseOver={e=>plus.current.classList.add(styles.plusDisplay)} onMouseOut={e=>!props.item?.invitedLocal &&!loading && plus.current.classList.remove(styles.plusDisplay)}>
            <div className={styles.imageContainer}>

                <UserImg img={props.item?.img} />

                <div className={`${styles.plus} ${loading||props.item?.invitedLocal?styles.plusDisplay:''}`} ref={plus}>
                    {loading?<Loading2 class={styles.loadingSVG} />:props.item?.invitedLocal?<OkIcon />:<PlusIcon />}
                    
                </div>

            </div>

            <h2 className={styles.userHeader}>{props.item?.username}</h2>
                                
        </div>
    )
}

export default FriendItem