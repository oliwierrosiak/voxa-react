import { useRef, useState } from 'react'
import styles from './login.module.css'
import Eye from '../../assets/svg/eye'
import EyeOff from '../../assets/svg/EyeOff'

function LoginForm()
{

    const [emailValue,setEmailValue] = useState('')
    const [passwordValue,setPasswordValue] = useState('')
    const [showPassword,setShowPassword] = useState(false)

    const inputFocus = (e) =>
    {
        e.target.closest('div').classList.add(styles.inputFocused)
        const placeholder = e.target.closest('div').children[1]
        placeholder.classList.add(styles.placeholderWhileInputIsFocus)
        placeholder.classList.add(styles.placeholderWhileInputIsFocusColor)
    }

    const inputBlur = (e) =>{
        e.target.closest('div').classList.remove(styles.inputFocused)
        const placeholder = e.target.closest('div').children[1]
        if(e.target.value.trim() == "")
        {
            placeholder.classList.remove(styles.placeholderWhileInputIsFocus)
            placeholder.classList.remove(styles.placeholderWhileInputIsFocusColor)
        }
        else
        {
             placeholder.classList.remove(styles.placeholderWhileInputIsFocusColor)
        }
    }

    return(
        <>
        <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
            <input type='text' className={styles.input} onFocus={inputFocus} onBlur={inputBlur} onChange={e=>setEmailValue(e.target.value)} value={emailValue}></input>
            <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                Podaj Adres Email
            </h2>
        </div>

        <div className={styles.error}></div>

        <div className={styles.inputContainer} onClick={e=>e.target.classList.contains(styles.inputContainer)?e.target.children[0].focus():null}>
            <input type={showPassword?"text":"password"} className={`${styles.input} ${styles.passwordInput}`} onFocus={inputFocus} onBlur={inputBlur} onChange={e=>setPasswordValue(e.target.value)} value={passwordValue}></input>
            <h2 className={styles.inputPlaceholder} onClick={e=>e.target.closest('div').children[0].focus()}>
                Podaj Hasło
            </h2>
            <div className={styles.eye} onClick={e=>setShowPassword(!showPassword)}>
                {showPassword?<Eye />:<EyeOff />}
            </div>
        </div>


        <div className={styles.error}></div>

        <div className={styles.line}></div>

        <button className={styles.submit}>Zaloguj się!</button>

        <button className={styles.googleLogin}>Kontynuj z Google</button>
        <p className={styles.haveNotAnAccount}>Nie masz jeszcze konta? <a href='' onClick={e=>e.preventDefault()} className={styles.registerLink}>Zarejestruj się!</a></p>
        </>
    )
}

export default LoginForm