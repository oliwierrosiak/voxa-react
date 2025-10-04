import { useEffect, useRef, useState } from "react"
import refreshToken from "../helpers/refreshToken"
import axios from "axios"
import ApiAddress from "../../ApiAddress"
import styles from './chat.module.css'
import Loading2 from "../../assets/svg/loading2"
import PlayIcon from "../../assets/svg/play"

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
            const responseInfo = await axios.get(`${ApiAddress}/get-chat-img-info/${img.split('/').at(-1)}`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})


            const localImg = [...imgs.current]
            if(responseInfo?.data?.type === "video")
            {   
                localImg.push({url:responseInfo.data.icon,type:"video"})
            }
            else
            {
                localImg.push({url:img})
            }
            imgs.current = [...localImg]
        }
        catch(ex)
        {
            const localImg = [...imgs.current]
            localImg.push('error')
            imgs.current = [...localImg]
            setLoading(false)
        }

        if(imgs.current.length === props.imgs.length)
        {
            setImgsState([...imgs.current])
            setLoading(false)
            if(props.lastMedia)
            {
                setTimeout(() => {
                    props.scrollFunc()
                }, 400);

            }
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

    const setImgError = (img) =>
    {
        const imgs = [...imgsState]
        const imgMapped = imgs.map(x=>{
            return x===img?'error':x
        })
        setImgsState([...imgMapped])
    }

    return(
        loading?<div className={styles.photoLoadingContainer}>
            <Loading2 class={styles.photoLoading}/>
        </div>:(
        imgsState.map((x,idx)=>{
            if(x==="error")
            {
                return <div key={Math.floor(Math.random()*1000)} className={styles.imageError}>Błąd pobierania zdjęcia</div>
            }
            else
            {
                return x?.type !== "video"?<img key={Math.floor(Math.random()*1000)} className={styles.chatImg} src={x.url} onClick={e=>props.galleryHandler(x)} onError={e=>setImgError(x)}/>:
                <div className={styles.videoOverlay} key={Math.floor(Math.random()*10000)}>
                    <img className={styles.chatImg} src={x.url} onClick={e=>props.galleryHandler(x)} onError={e=>setImgError(x)}/>
                    <div className={styles.videoPlay} onClick={e=>props.galleryHandler(x)}><PlayIcon class={styles.videoPlaySVG}/></div>
                </div>
            }
        })
        )
    )
}

export default GetPhotos