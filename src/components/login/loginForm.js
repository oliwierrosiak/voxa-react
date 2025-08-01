import { useEffect, useRef, useState } from 'react'
import styles from './login.module.css'
import Eye from '../../assets/svg/eye'
import EyeOff from '../../assets/svg/EyeOff'
import googleLogo from '../../assets/img/google-icon.png'
import Loading from '../../assets/svg/loading1'
import { inputBlur,inputFocus } from './inputActions'

function LoginForm(props)
{

    const [emailValue,setEmailValue] = useState('')
    const [passwordValue,setPasswordValue] = useState('')
    const [showPassword,setShowPassword] = useState(false)
    const [formError,setFormError] = useState({
        email:'',
        password:''
    })


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
                console.log("send")
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

    return(
        <form onSubmit={validateData} className={styles.form}>
        <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
            <input type='text' className={styles.input} disabled={props.loading} onFocus={inputFocus} onBlur={inputBlur} onChange={e=>setEmailValue(e.target.value)} value={emailValue}></input>
            <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                Podaj Adres Email
            </h2>
        </div>

        <div className={styles.error}>{formError.email}</div>

        <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
            <input type={showPassword?"text":"password"} disabled={props.loading} className={`${styles.input} ${styles.passwordInput}`} onFocus={inputFocus} onBlur={inputBlur} onChange={e=>setPasswordValue(e.target.value)} value={passwordValue}></input>
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

        <button className={styles.googleLogin}>
            <img src={googleLogo} className={styles.googleIcon}/>
            Kontynuj z Google
        </button>
        <p className={styles.haveNotAnAccount}>Nie masz jeszcze konta? <a href='' onClick={registerClicked} className={styles.registerLink}>Zarejestruj się!</a></p>
        </form>
    )
}

export default LoginForm