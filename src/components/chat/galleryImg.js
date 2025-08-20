import { useEffect, useState } from "react"
import refreshToken from "../helpers/refreshToken"
import axios from "axios"
import ApiAddress from "../../ApiAddress"
import Loading2 from "../../assets/svg/loading2"
import styles from './chat.module.css'
import ErrorIcon from "../../assets/svg/error"

function GalleryImg(props)
{
    const [loading,setLoading] = useState(true)
    const [url,setUrl] = useState('')
    const [error,setError] = useState(false)
    const [video,setVideo] = useState(false)

    const getPhoto = async() =>{
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-chat-img/${props.img}`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`},responseType:"blob"})
            const localUrl = URL.createObjectURL(response.data)
            setUrl(localUrl)
            setLoading(false)
        }
        catch(ex)
        {
            setError(true)
            setLoading(false)
        }
    }

    const checkExtension = () =>{
        if(props.img)
        {
        const extension = props.img.split('.')[1]
        const extensions = ['mp4','webm','ogg','ogv','avi','mov','mkv','flv','wmv','mpeg','mpg','m4v','3gp','3g2']
        if(extensions.includes(extension))
        {
            setVideo(true)
        }
        }
        

    }

    useEffect(()=>{
        setLoading(true)
        setError(false)
        getPhoto()
        setVideo(false)
        checkExtension()
    },[props])

    return(
        loading?<Loading2 class={styles.galleryLoading} />:error?<div className={styles.photoError}>
            <ErrorIcon />
            <h2>Błąd pobierania</h2>
        </div>:video?<video controls src={url} className={styles.galleryVideo}/>:<img src={url} className={styles.galleryImg}/>
    )
}

export default GalleryImg