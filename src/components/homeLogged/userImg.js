import { useEffect, useState } from "react"
import Loading2 from "../../assets/svg/loading2"
import styles from './homeLogged.module.css'
import refreshToken from "../helpers/refreshToken"
import axios from "axios"
import ApiAddress from "../../ApiAddress"
import defaultImg from '../../assets/img/default.jpg'

function UserImg(props)
{
    const [loading,setLoading] = useState(true)
    const [img,setImg] = useState('')

    const getImg = async()=>
    {
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-user-img/${props.img}`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`},responseType:'blob'})
            const imgUrl = URL.createObjectURL(response.data)
            setImg(imgUrl)
            setLoading(false)
        }
        catch(ex)
        {
            setImg(defaultImg)
            setLoading(false)
        }
    }

    useEffect(()=>{
        setLoading(true)
        getImg()
    },[props.img])

    return(
        loading?<Loading2 class={styles.loadingSVG}/>:<img src={img} />
    )
}

export default UserImg