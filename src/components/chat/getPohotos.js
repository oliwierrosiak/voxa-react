import { useEffect, useRef, useState } from "react"
import refreshToken from "../helpers/refreshToken"
import axios from "axios"
import ApiAddress from "../../ApiAddress"
import styles from './chat.module.css'
import Loading2 from "../../assets/svg/loading2"

function GetPhotos(props)
{
    const imgs = useRef([])

    const [imgsState,setImgsState] = useState([])
    const [loading,setLoading] = useState(true)

    const getImages = async(img) =>
    {
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-chat-img/${img}`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`},responseType:"blob"})
            console.log(response.data)
            if(response.data)
            {
                const localImg = [...imgs.current]
                const url = URL.createObjectURL(response.data)
                localImg.push({type:response.data.type,url})
                imgs.current = [...localImg]
                
            }
            else
            {
                throw new Error()
            }
        }
        catch(ex)
        {
            const localImg = [...imgs.current]
            localImg.push("error")
            imgs.current = [...localImg]
        }

        if(imgs.current.length === props.imgs.length)
        {
            setImgsState([...imgs.current])
            setLoading(false)
            setTimeout(() => {
                props.scrollFunc()
            }, 100);
        }
    }

    useEffect(()=>{
        for(let i = 0;i<props.imgs.length;i++)
        {
            getImages(props.imgs[i])
        }
    },[])

    useEffect(()=>{
        console.log(imgsState)
    },[imgsState])

    return(
        loading?<div className={styles.photoLoadingContainer}>
            <Loading2 class={styles.photoLoading}/>
        </div>:(
        imgsState.map((x)=>{
            if(x==="error")
            {
                return <div className={styles.imageError}>Błąd pobierania zdjęcia</div>
            }
            else if(x.type.includes('image'))
            {
                return <img className={styles.chatImg} src={x.url}/>
            }
            else
            {
                return <video className={styles.chatVideo} controls src={x.url} />
            }
        })
        )
    )
}

export default GetPhotos