import { useContext, useEffect, useState } from 'react'
import styles from './chat.module.css'
import Loading2 from '../../assets/svg/loading2'
import refreshToken from '../helpers/refreshToken'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import { useParams } from 'react-router-dom'
import messageContext from '../context/messageContext'
import GalleryImg from './galleryImg'
import GalleryArrowIcon from '../../assets/svg/galleryArrow'

function Gallery(props)
{

    const [loading,setLoading] = useState(true)
    const params = useParams()
    const message = useContext(messageContext)
    const [imgs,setImgs] = useState([])
    const [displayPhoto,setDisplayPhoto] = useState('')

    const getPhotosData = async()=>{
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-chat-imgs-data/${params.id}`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            setImgs(response.data)

        }
        catch(ex)
        {
            message.setContent('Nie udało się załadować galerii',"error")
            props.setShowGallery(false)
        }
    }

    useEffect(()=>{
        if(imgs[0])
        {
            if(!imgs.includes(props.clickedPhoto))
            {
                const searchingValue = props.clickedPhoto.split('.')[0]
                const video = imgs.find((x)=>{
                    const rawValue = x.split('.')[0]
                    if(searchingValue === rawValue)
                    {
                        return x
                    }
                    else
                    {
                        return null
                    }
                })
                setDisplayPhoto(video)
                setLoading(false)
            }
            else
            {
                setDisplayPhoto(props.clickedPhoto)
                setLoading(false)
            }
        }
    },[imgs])

    const galleryClicked = (e) =>{
        if(e.target.classList.contains(styles.gallery))
        {
            props.setShowGallery(false)
        }
    }

    const changePhoto = (direction) =>
    {
        
        const index = imgs.findIndex(x=>x === displayPhoto)
        if(direction === "left")
        {
            if(index !== 0)
            {
                setDisplayPhoto(imgs[index-1])

            }
        }
        else if(direction === "right")
        {
            if(index !== imgs.length-1)
            {
                setDisplayPhoto(imgs[index+1])

            }
        }

    }

    useEffect(()=>{
        getPhotosData()
    },[])

    return(
        <div className={styles.gallery} onClick={galleryClicked}>
            <div className={`${styles.leftArrowContainer} ${displayPhoto === imgs[0]?styles.arrowDisabled:''}`} onClick={e=>changePhoto('left')}>
                <GalleryArrowIcon class={styles.leftArrow}/>
            </div>
            {loading?<Loading2 class={styles.galleryLoading}/>:<GalleryImg img={displayPhoto} changePhoto={changePhoto}/>}
             <div className={`${styles.rightArrowContainer} ${displayPhoto === imgs.at(-1)?styles.arrowDisabled:''}`} onClick={e=>changePhoto('right')}>
                <GalleryArrowIcon class={styles.rightArrow}/>
            </div>
        </div>
    )
}

export default Gallery