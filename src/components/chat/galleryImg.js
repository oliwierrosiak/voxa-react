import { useEffect, useRef, useState } from "react"
import styles from './chat.module.css'
import ErrorIcon from "../../assets/svg/error"

let touchStart = 0

function GalleryImg(props)
{
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

    const checkExtension = () =>{
        if(props.img)
        {
            const extensions = ['mp4','webm','ogg','ogv','avi','mov','mkv','flv','wmv','mpeg','mpg','m4v','3gp','3g2']
            for(const extension of extensions)
            {
                if(props.img.includes(extension))
                {
                    setVideo(true)
                    break
                }
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
        setError(!props.img)
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
        if(deltaX > 120)
        {
            props.changePhoto("left")
        }
        else if(deltaX < -120)
        {
            props.changePhoto("right")
        }
    }

    return(
        error?<div className={styles.photoError} id="gallery" onTouchStart={touchStartFunc} onTouchEnd={touchEndFunc}>
            <ErrorIcon class={styles.errorIcon}/>
            <h2 id="gallery">Błąd pobierania</h2>
        </div>:video?<video id="gallery" loading="lazy" controls src={props.img} onTouchStart={touchStartFunc} onTouchEnd={touchEndFunc} className={styles.galleryVideo} onError={e=>setError(true)}/>:<div className={styles.galleryImgContainer} onTouchStart={touchStartFunc} onTouchEnd={touchEndFunc} onWheel={zoomImg}>
        <img id="gallery" loading="lazy" src={props.img} draggable={false} onError={e=>setError(true)} style={{
          transform: `translate(${positions.x}px, ${positions.y}px) scale(${zoom})`
        }} className={styles.galleryImg} ref={imgRef} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}/></div>
    )
}

export default GalleryImg