import { useContext, useEffect, useRef, useState } from 'react'
import TopBar from '../topBar/topBar'
import styles from './profile.module.css'
import Loading2 from '../../assets/svg/loading2'
import refreshToken from '../helpers/refreshToken'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import ErrorIcon from '../../assets/svg/error'
import defaultImage from '../../assets/img/default.jpg'
import Camera from '../../assets/svg/camera'
import { Form, useNavigate } from 'react-router-dom'
import messageContext from '../context/messageContext'

function Profile()
{
    const [userData,setUserData] = useState({})
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)
    const [imgLoading,setImgLoading] = useState(true)
    const [img,setImg] = useState('')

    const date = new Date().getHours()

    const fileRef = useRef()

    const navigate = useNavigate()
    const message = useContext(messageContext)

    const getUserData = async()=>{
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-profile`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            setUserData(response.data)
            setLoading(false)
        }
        catch(ex)
        {
            if(ex.status == 403)
            {
                navigate('/')
            }
            setError(true)
            setLoading(false)
        }
    }

    const getUserImg = async() =>
    {
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/user-img`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`},responseType:"blob"})
            const url = URL.createObjectURL(response.data)
            setImg(url)
            setImgLoading(false)
        }
        catch(ex)
        {
            setImg(defaultImage)
            setImgLoading(false)
        }
    }

    const sendPhoto = async(e)=>
    {
        const photo = e.target.files[0]
        try
        {
            setLoading(true)
            const formData = new FormData()
            formData.append('image',photo)
            await refreshToken()
            const response = await axios.post(`${ApiAddress}/update-user-img`,formData,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            getUserData()
        }
        catch(ex)
        {
            message.setContent('Nie udało się zaaktualizować zdjęcia',"error")
            setLoading(false)
        }
    }

    useEffect(()=>{
        getUserData()
    },[])

    useEffect(()=>{
        if(userData.img)
        {
            getUserImg()
        }
    },[userData])

    return(
        <>

        <TopBar />
        
        {loading || error?<main className={styles.loadingMain}>
            {loading?<Loading2 class={styles.loading} />:<>
            <ErrorIcon class={styles.errorIcon}/>
            <h2>Bład pobierania danych użytkownika</h2>
            </>}
            
        </main>
        :

        <main className={styles.container}>

        <h1 className={styles.header}>{date < 19 ?"Dzień dobry ":"Dobry wieczór "}{userData.name}!</h1>

        <div className={styles.imgElement}>

            <div className={styles.imgContainer} onClick={e=>fileRef.current.click()}>
                {imgLoading?<Loading2 class={styles.imgLoading} />:<img src={img} />}
                <div className={styles.overlay}>
                    <Camera />
                </div>
            </div>

            <button className={styles.changeImg} onClick={e=>fileRef.current.click()}>Zmień zdjęcie profilowe</button>

            <input type='file' className={styles.fileInput} ref={fileRef} accept='image/*' onChange={sendPhoto}/>

        </div>

        <div className={`${styles.inputContainer} ${styles.emailInput}`}>

        </div>

        <div className={`${styles.inputContainer} ${styles.nameInput}`}>

        </div>

        <div className={`${styles.inputContainer} ${styles.usernameInput}`}>

        </div>

        <button className={styles.changePassword}></button>

        <button className={styles.deleteAccount}></button>

        </main>}

        </>
    )
}

export default Profile