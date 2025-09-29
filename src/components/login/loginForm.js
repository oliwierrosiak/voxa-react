import { useContext, useEffect, useState } from 'react'
import styles from './login.module.css'
import Eye from '../../assets/svg/eye'
import EyeOff from '../../assets/svg/EyeOff'
import googleLogo from '../../assets/img/google-icon.png'
import Loading from '../../assets/svg/loading1'
import { inputBlur,inputFocus } from './inputActions'
import axios from 'axios'
import ApiAddress from '../../ApiAddress.js'
import LoginContext from '../context/loginContext.js'
import loggedUser from '../context/loggedUserContext.js'
import messageContext from '../context/messageContext.js'
import setDocumentTitle from '../helpers/useDocumentTitle.js'
import { useGoogleLogin } from '@react-oauth/google'

function LoginForm(props)
{
    const message = useContext(messageContext)
    const loggedUserContext = useContext(loggedUser)
    const loggedContext = useContext(LoginContext)
    const [emailValue,setEmailValue] = useState('')
    const [passwordValue,setPasswordValue] = useState('')
    const [showPassword,setShowPassword] = useState(false)
    const [formError,setFormError] = useState({
        email:'',
        password:''
    })

    const sendData = async()=>
    {
        try
        {
            const response = await axios.post(`${ApiAddress}/login`,{email:emailValue,password:passwordValue})
            sessionStorage.setItem("token",response.data.token)
            sessionStorage.setItem("refreshToken",response.data.refreshToken)
            loggedContext.setLogged(true)
            loggedUserContext.setLoggedUser(response.data)
        }
        catch(ex)
        {
            const errors = {...formError}
            if(ex?.response?.data?.status === 401)
            {
                errors.password = "Nieprawidłowe dane"
            }
            else
            {
                errors.password = "Błąd połączenia z serwerem"
            }
            props.setLoading(false)
            setFormError(errors)
        }
    }

    const validateData = (e) =>
    {
        e.preventDefault()
        if(!props.loading)
        {
            const errors = {
            email:'',
            password:'',
            }
            if(emailValue.trim() === "")
            {
                errors.email = `Podaj adres email`
            }
            if(passwordValue.trim() === "")
            {
                errors.password = `Podaj hasło`
            }
            if(errors.email || errors.password)
            {
                setFormError({
                    email:errors.email,
                    password:errors.password
                })
            }
            else
            {
                 setFormError({
                    email:errors.email,
                    password:errors.password
                })
                props.setLoading(true)
                sendData()
            }
        }
    }

    const registerClicked = (e) =>
    {
        e.preventDefault()
        if(!props.loading)
        {
            props.setLoginAction("register")
        }
    }
    const googleLoginError = () =>{
        message.setContent('Bład logowanie google',"error")
    }


    const googleLogin = async(res)=>{
        try
        {
            const response = await axios.post(`${ApiAddress}/google-login`,{token:res.access_token})
            sessionStorage.setItem("token",response.data.token)
            sessionStorage.setItem("refreshToken",response.data.refreshToken)
            loggedContext.setLogged(true)
            loggedUserContext.setLoggedUser(response.data)
        }
        catch(ex)
        {
            googleLoginError()
        }
    }

    useEffect(()=>{
        setDocumentTitle('Voxa - Logowanie')
    },[])

    const loginWithGoogle = useGoogleLogin({
        onSuccess: (res) => {
            axios.get(
                `https://www.googleapis.com/oauth2/v3/userinfo`,
                { headers: { Authorization: `Bearer ${res.access_token}` } }
            ).then(userInfo => {
                googleLogin(res)
            }).catch(() => googleLoginError())
        },
        onError: googleLoginError,
    })

    return(
        <form noValidate onSubmit={validateData} className={styles.form}>
        <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
            <input type='email' autoComplete="email" className={styles.input} disabled={props.loading} onFocus={inputFocus} onBlur={inputBlur} onChange={e=>setEmailValue(e.target.value)} value={emailValue}></input>
            <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                Podaj Adres Email
            </h2>
        </div>

        <div className={styles.error}>{formError.email}</div>

        <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
            <input type={showPassword?"text":"password"} autoComplete="current-password" disabled={props.loading} className={`${styles.input} ${styles.passwordInput}`} onFocus={inputFocus} onBlur={inputBlur} onChange={e=>setPasswordValue(e.target.value)} value={passwordValue}></input>
            <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                Podaj Hasło
            </h2>
            <div className={styles.eye} onClick={e=>!props.loading?setShowPassword(!showPassword):null}>
                {showPassword?<Eye />:<EyeOff />}
            </div>
        </div>


        <div className={styles.error}>{formError.password}</div>

        <div className={styles.line}></div>

        <button className={`${styles.submit} ${props.loading?styles.btnLoading:""}`} type='submit'>{props.loading?<Loading />:"Zaloguj się!"}</button>

        <button type='button' className={styles.googleLogin} onClick={loginWithGoogle}>
            <img src={googleLogo} className={styles.googleIcon}/>
            Kontynuj z Google
        </button>

        <p className={styles.passwordForgotten} onClick={e=>props.setLoginAction('passwordForgotten')}>Zapominałeś hasła?</p>

        <p className={styles.haveNotAnAccount}>Nie masz jeszcze konta? <a href='' onClick={registerClicked} className={styles.registerLink}>Zarejestruj się!</a></p>
        </form>
    )
}

export default LoginForm