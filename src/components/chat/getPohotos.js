import { useEffect, useRef, useState } from "react"
import refreshToken from "../helpers/refreshToken"
import axios from "axios"
import ApiAddress from "../../ApiAddress"
import styles from './chat.module.css'
import Loading2 from "../../assets/svg/loading2"

function GetPhotos(props)
{
    const imgs = useRef([])
    const imgsOriginalName = useRef([])

    const [imgsState,setImgsState] = useState([])
    const [loading,setLoading] = useState(true)

    const getImages = async(img) =>
    {
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-chat-img/${img}`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`},responseType:"blob"})
            if(response.data)
            {
                const localImg = [...imgs.current]
                const localImgsOriginalName = [...imgsOriginalName.current]
                const url = URL.createObjectURL(response.data)
                localImg.push({type:response.data.type,url})
                if(response.data.type.includes("image"))
                {
                    localImgsOriginalName.push(img)
                }
                imgs.current = [...localImg]
                imgsOriginalName.current = [...localImgsOriginalName]
            }
            else
            {
                throw new Error()
            }
        }
        catch(ex)
        {
            const localImgsOriginalName = [...imgsOriginalName.current]
            localImgsOriginalName.push("error")
            const localImg = [...imgs.current]
            localImg.push("error")
            imgs.current = [...localImg]
            imgsOriginalName.current = [...localImgsOriginalName]
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

    const getImgFor = async() =>{
         for(let i = 0;i<props.imgs.length;i++)
        {
            await getImages(props.imgs[i])
        }
    }

    useEffect(()=>{
       getImgFor()
    },[])

    return(
        loading?<div className={styles.photoLoadingContainer}>
            <Loading2 class={styles.photoLoading}/>
        </div>:(
        imgsState.map((x,idx)=>{
            if(x==="error")
            {
                return <div key={Math.floor(Math.random()*1000)} className={styles.imageError}>Błąd pobierania zdjęcia</div>
            }
            else if(x.type.includes('image'))
            {
                return <img key={Math.floor(Math.random()*1000)} className={styles.chatImg} src={x.url} onClick={e=>props.galleryHandler(imgsOriginalName.current[idx])}/>
            }
            else
            {
                return <video key={Math.floor(Math.random()*1000)} className={styles.chatVideo} controls src={x.url} />
            }
        })
        )
    )
}

export default GetPhotos