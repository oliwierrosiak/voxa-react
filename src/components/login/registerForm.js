import styles from './login.module.css'
import { inputBlur, inputFocus } from './inputActions'
import { useEffect, useReducer, useState, useContext } from 'react'
import Eye from '../../assets/svg/eye'
import EyeOff from '../../assets/svg/EyeOff'
import userImg from '../../assets/img/default.jpg'
import Camera from '../../assets/svg/camera'
import axios from 'axios'
import ApiAddress from '../../ApiAddress'
import LoginContext from '../context/loginContext'
import loggedUser from '../context/loggedUserContext'
import setDocumentTitle from '../helpers/useDocumentTitle'
import messageContext from '../context/messageContext'

function RegisterForm(props)
{
    let timeout
    const message = useContext(messageContext)
    const loggedUserContext = useContext(loggedUser)
    const loggedContext = useContext(LoginContext)
    const [showPassword,setShowPassword] = useState(false)
    const[previewImg,setPreviewImg] = useState(userImg)
    const [errors,setErrors] = useState({
        name:'',
        email:'',
        password:'',
        repeatPassword:'',
        username:''
    })
    const [file,setFile] = useState(null)

    const reducer = (state,action) => {

        const newState = {...state}
        newState[action.type] = action.value
        return newState
    }

    const [values,dispatch] = useReducer(reducer,{
        name:'',
        email:'',
        password:'',
        repeatPassword:'',
        username:''
    })

    const sendData = async()=>{
        try
        {
            const formData = new FormData()
            formData.append('image',file)
            formData.append('name',values.name)
            formData.append('email',values.email)
            formData.append('password',values.password)
            formData.append('username',values.username)
            timeout = setTimeout(() => {
                message.setContent('Rejestracja może zająć wiecej czasu ze względu na rozruch serwera','info')
            }, 5000);
            await axios.post(`${ApiAddress}/register`,formData,{
            headers:{
                "Content-Type":"multipart/form-data"
            }})
            clearTimeout(timeout)
            const response = await axios.post(`${ApiAddress}/login`,{email:values.email,password:values.password})
            sessionStorage.setItem("token",response.data.token)
            sessionStorage.setItem("refreshToken",response.data.refreshToken)
            const response2 = await axios.get(`${ApiAddress}/get-user-data`,{headers:{"Authorization":`Bearer ${response.data.token}`}})
            loggedUserContext.setLoggedUser({name:response2.data.name,username:response2.data.username,email:response2.data.email})
            loggedContext.setLogged(true)
        }
        catch(ex)
        {
            clearTimeout(timeout)
            const err = {...errors}
            if(ex.status === 400)
            {
                err.name = ex.response.data.errors.name
                err.email = ex.response.data.errors.email
                err.password = ex.response.data.errors.password
                err.username = ex.response.data.errors.username || "Wystąpił bład serwera"
                err.repeatPassword = ``
                
            }
            else
            {
                err.username = "Wystąpił błąd serwera"
                err.name = ``
                err.email = ``
                err.password = ``
                err.repeatPassword = ``
            }
            setErrors(err)
            props.setRegisterValidation(false)
            props.setLoading(false)
           
        }
    }

    const fileChanged = (e) =>
    {
        if(e.target.files[0].type.includes("image"))
        {
            const imgURL = URL.createObjectURL(e.target.files[0])
            setPreviewImg(imgURL)
            setFile(e.target.files[0])
        }
    }

    const emailRegex = (email) =>
    {
        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        return regex.test(email)
    }

    const passwordRegex = (passwd) =>
    {
        const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        return regex.test(passwd)
    }

    useEffect(()=>{
        if(errors.img || errors.username)
        {
            props.setCard(2)
        }
        if(errors.password || errors.repeatPassword)
        {
            props.setCard(1)
        }
        if(errors.name || errors.email)
        {
            props.setCard(0)
        }
        
    },[errors])

    const validateData = () => {
        const errors = {
            name:'',
            email:'',
            password:'',
            repeatPassword:'',
            username:''
        }
        setErrors(errors)
        if(!values.name.trim())
        {
            errors.name = `Podaj imię`
        }
        if(!values.email.trim())
        {
            errors.email = `Podaj adres email`
        }
        else if(!emailRegex(values.email))
        {
            errors.email = `Podaj prawidłowy adres`
        }
        if(!values.password)
        {
            errors.password = `Podaj hasło`
        }
        else if(!passwordRegex(values.password))
        {
            errors.password = `Podaj silniejsze hasło`
        }
        if(!values.repeatPassword)
        {
            errors.repeatPassword = `Powtórz hasło`
        }
        else if(values.password != values.repeatPassword)
        {
            errors.repeatPassword = `Hasła nie są identyczne`
        }
        if(!values.username)
        {
            errors.username = `Podaj nazwę`
        }
       
        setErrors(errors)
        
        let validateComplete = true
        for(const key in errors)
        {
            if(errors[key])
            {
                validateComplete = false
            }
        }
        if(validateComplete)
        {
            props.setLoading(true)
            sendData()
        }
        else
        {
            props.setRegisterValidation(false)
        }

    }

    useEffect(()=>{
        if(props.registerValidation)
        {
            validateData()
        }
    },[props.registerValidation])

    useEffect(()=>{
        setDocumentTitle("Voxa - Rejestracja")
        window.addEventListener("keydown",props.keyPressed)
        return ()=>{
            window.removeEventListener("keydown",props.keyPressed)
        }
    },[])

    return(
        <div className={styles.cardSpinner}>
        <div className={`${styles.card} ${props.registerCard === 0?styles.cardPosition2 :( props.registerCard === 1 ? styles.cardPosition1: styles.cardPosition0)}`}>
            <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
                <input type='text' className={styles.input} disabled={props.loading} onFocus={inputFocus} onBlur={inputBlur} value={values.name} onChange={e=>dispatch({type:'name',value:e.target.value})}></input>
                <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                    Wprowadź Swoje Imię
                </h2>
            </div>

            <div className={styles.error}>{errors.name}</div>

            <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
                <input type="text" disabled={props.loading} className={styles.input} onFocus={inputFocus} onBlur={inputBlur} value={values.email} onChange={e=>dispatch({type:'email',value:e.target.value})}></input>
                <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                    Podaj swój adres email
                </h2>
            </div>

            <div className={styles.error}>{errors.email}</div>
        </div>
        

        <div className={`${styles.card} ${props.registerCard === 0?styles.cardPosition3 :( props.registerCard === 1 ? styles.cardPosition2: styles.cardPosition1)}`}>
            <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
                <input type={showPassword?"text":"password"} className={`${styles.input} ${styles.passwordInput}`} disabled={props.loading} onFocus={inputFocus} onBlur={inputBlur} value={values.password} onChange={e=>dispatch({type:'password',value:e.target.value})}></input>
                <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                    Utwórz hasło
                </h2>
                <div className={styles.eye} onClick={e=>!props.loading?setShowPassword(!showPassword):null}>
                {showPassword?<Eye />:<EyeOff />}
                </div>
            </div>

            <div className={styles.error}>{errors.password}</div>

            <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
                <input type={showPassword?"text":"password"} disabled={props.loading} className={`${styles.input} ${styles.passwordInput}`} onFocus={inputFocus} onBlur={inputBlur} value={values.repeatPassword} onChange={e=>dispatch({type:'repeatPassword',value:e.target.value})}></input>
                <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                    Powtórz hasło
                </h2>
                <div className={styles.eye} onClick={e=>!props.loading?setShowPassword(!showPassword):null}>
                {showPassword?<Eye />:<EyeOff />}
                </div>
            </div>

            <div className={styles.error}>{errors.repeatPassword}</div>
        </div>


        <div className={`${styles.card} ${props.registerCard === 0?styles.cardPosition4 :( props.registerCard === 1 ? styles.cardPosition3: styles.cardPosition2)}`}>
            <div className={styles.fileContainer}>
                <input type='file' ref={file} accept="image/*" className={styles.file} title='' onChange={fileChanged} ></input>
                <img src={previewImg} className={styles.userImg}/>
                <span className={styles.imgTheme}><Camera /></span>
            </div>

            <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
                <input type="text" disabled={props.loading} className={styles.input} onFocus={inputFocus} onBlur={inputBlur} value={values.username} onChange={e=>dispatch({type:'username',value:e.target.value})}></input>
                <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                    Utwórz nazwę użytkownika
                </h2>
            </div>

            <div className={styles.error}>{errors.username}</div>
        </div>
        </div>
        
    )
}

export default RegisterForm