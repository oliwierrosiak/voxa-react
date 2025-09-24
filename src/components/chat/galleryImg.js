import { useEffect, useRef, useState } from "react"
import refreshToken from "../helpers/refreshToken"
import axios from "axios"
import ApiAddress from "../../ApiAddress"
import Loading2 from "../../assets/svg/loading2"
import styles from './chat.module.css'
import ErrorIcon from "../../assets/svg/error"

let touchStart = 0

function GalleryImg(props)
{
    const [loading,setLoading] = useState(true)
    const [url,setUrl] = useState('')
    const [error,setError] = useState(false)
    const [video,setVideo] = useState(false)
    const [zoom,setZoom] = useState(1)
    const [dragging,setDragging] = useState(false)
    const [positions,setPositions] = useState({
        x:0,
        y:0,
    })
    const [start,setStart] = useState({
        x:0,
        y:0,
    })

    const imgRef = useRef()

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

    const zoomImg = (e) =>
    {
        if(e.deltaY<0)
        {
            if(zoom<15)
            {
                setZoom(zoom+0.5)
            }
        }
        else
        {
            if(zoom>1)
            {
                setZoom(zoom-0.5)
                setStart({x:0,y:0})
                setPositions({x:0,y:0})
                
            }
        }
    }

    const handleMouseDown = (e) => {
        e.preventDefault();
        if(zoom > 1)
        {
            setDragging(true);
            setStart({
            x: e.clientX - positions.x,
            y: e.clientY - positions.y,
            });
        }
    };

  const handleMouseMove = (e) => {
    if (dragging)
    {
        const maxWidth = (imgRef.current.clientWidth * zoom - imgRef.current.clientWidth)/2
        const maxHeight = (imgRef.current.clientHeight * zoom -imgRef.current.clientHeight)/2

        let localX = 0
        let localY = 0
        if(Math.abs(e.clientX - start.x) < maxWidth)
        {
            localX = e.clientX - start.x
        }
        else
        {
            localX = positions.x
        }

        if(Math.abs(e.clientY - start.y) < maxHeight)
        {
            localY = e.clientY - start.y
        }
        else
        {
            localY = positions.y
        }

        setPositions({
            x: localX,
            y: localY,
        });
    }
    
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

    useEffect(()=>{
        if(imgRef.current)
        {
            if(zoom>1)
            {
                imgRef.current.style.cursor = `grab`
            }
            else
            {
                imgRef.current.style.cursor = `default`
            }
        }
    },[zoom])

    useEffect(()=>{
        setLoading(true)
        setError(false)
        getPhoto()
        setVideo(false)
        checkExtension()

    setZoom(1)
   setDragging(false)
   setPositions({
        x:0,
        y:0,
    })
    setStart({
        x:0,
        y:0,
    })

    },[props])

    const touchStartFunc = (e) =>
    {
        touchStart = e.touches[0].clientX
    }

    const touchEndFunc = (e) =>
    {
        let endX = e.changedTouches[0].clientX;
        let deltaX = endX - touchStart;
        if(deltaX > 50)
        {
            props.changePhoto("left")
        }
        else if(deltaX < -50)
        {
            props.changePhoto("right")
        }
    }

    return(
        loading?<Loading2 class={styles.galleryLoading} />:error?<div className={styles.photoError}>
            <ErrorIcon class={styles.errorIcon}/>
            <h2>Błąd pobierania</h2>
        </div>:video?<video loading="lazy" controls src={url} onTouchStart={touchStartFunc} onTouchEnd={touchEndFunc} className={styles.galleryVideo}/>:<div className={styles.galleryImgContainer} onTouchStart={touchStartFunc} onTouchEnd={touchEndFunc} onWheel={zoomImg}><img loading="lazy" src={url} draggable={false} style={{
          transform: `translate(${positions.x}px, ${positions.y}px) scale(${zoom})`
        }} className={styles.galleryImg} ref={imgRef} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}/></div>
    )
}

export default GalleryImg