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
import Input from './input'
import OkIcon2 from '../../assets/svg/ok2'

function Profile()
{
    const [userData,setUserData] = useState({})
    const [loading,setLoading] = useState(true)
    const [error,setError] = useState(false)
    const [imgLoading,setImgLoading] = useState(true)
    const [img,setImg] = useState('')

    const [inputValues,setInputValues] = useState({
        email:'',
        name:'',
        username:''
    })

    const date = new Date().getHours()

    const fileRef = useRef()

    const navigate = useNavigate()
    const message = useContext(messageContext)

    const getUserData = async()=>{
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/get-profile`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            setInputValues({
                email:response.data.email,
                name:response.data.name,
                username:response.data.username
            })
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

    const checkValue = () => {
        const values = {...inputValues}
        if(values.name.trim() === "")
        {
            values.name = userData.name
        }
        if(values.username.trim() === "")
        {
            values.username = userData.username
        }
        setInputValues(values)
    }

    const setValues = (value,type) =>{
        const values = {...inputValues}
        switch(type)
        {
            case 'name':
                values.name = value
                break
            case 'username':
                values.username = value
                break
        }
        setInputValues(values)
    }

    const sendName = async() =>
    {
        if(inputValues.name !== userData.name && inputValues.name.trim() !== "")
        {
            try
            {
                setLoading(true)
                await refreshToken()
                const response = await axios.patch(`${ApiAddress}/update-name`,{name:inputValues.name},{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
                getUserData()
            }
            catch(ex)
            {
                message.setContent('Nie udało się zmienić imienia','error')
                setLoading(false)
            }
        }
    }

    const sendUsername = async()=>{
        if(inputValues.username !== userData.username && inputValues.username.trim() !== "")
        {
            try
            {
                setLoading(true)
                await refreshToken()
                const response = await axios.patch(`${ApiAddress}/update-username`,{username:inputValues.username},{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
                getUserData()
            }
            catch(ex)
            {
                if(ex.response.data.message === "Duplicated username")
                {
                    message.setContent('Nazwa jest zajęta',"error")
                    setLoading(false)
                }
                else
                {
                    message.setContent('Nie udało się zmienić nazwy użytkownika',"error")
                    setLoading(false)
                }
            }
        }
    }

    const resetPassword = async() =>
    {
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/reset-password`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            message.setContent('Wiadomość została wysłana. Sprawdź swoja skrzynkę odbiorczą.','info')
        }
        catch(ex)
        {
            message.setContent('Nie można w tym momencie zresetować hasła','error')
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
            <Input value={inputValues.email} checkValue={checkValue} setValues={setValues} type="email" />
        </div>

        <div className={`${styles.inputContainer} ${styles.nameInput}`}>
            <Input value={inputValues.name} checkValue={checkValue} setValues={setValues} type="name" send={sendName}/>
        </div>

        <div className={`${styles.inputContainer} ${styles.usernameInput}`}>
            <Input value={inputValues.username} checkValue={checkValue} setValues={setValues} type="username" send={sendUsername}/>
            
        </div>

        <button className={styles.changePassword} onClick={resetPassword}>Resetuj Hasło</button>

        <button className={styles.deleteAccount}>Usuń Konto</button>

        </main>}

        </>
    )
}

export default Profile