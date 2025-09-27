import styles from './login.module.css'
import logo from '../../assets/img/voxalogo1.png'
import LoginForm from './loginForm'
import RegisterForm from './registerForm'
import Back from '../../assets/svg/back'
import { useRef, useState } from 'react'
import Loading from '../../assets/svg/loading2'

function ShowLogin(props)
{   

    const [loading,setLoading] = useState(false)

    const [registerCard,setRegisterCard] = useState(0)
    const [registerValidation,setRegisterValidation] = useState(false)

    const nextBtn = useRef()

    const hideLoginForm = (e) =>{
        if(e.target.classList.contains(styles.loginContainer) && !loading)
        {
            props.cancelLoginForm()

        }
    }


    const changeRegisterCard = (direction) => {
        if(direction === "asc")
        {
            setRegisterValidation(false)
            setRegisterCard(registerCard+1)
        }
        else if(direction === "desc")
        {
            setRegisterCard(registerCard-1)
        }
    }

    const setCard = (val) =>
    {
        setRegisterCard(val)
    }

    const keyPressed = (e) =>
    {
        if(e.key === "Enter")
        {
            nextBtn.current.click()
        }
    }


    return(
        <div className={styles.loginContainer} onClick={hideLoginForm}>
            <div className={styles.login}>
                <img src={logo} className={styles.logo}/>
                <div className={styles.back} onClick={e=>!loading?props.cancelLoginForm():null}>
                    <Back/>
                </div>
                {props.action === "login"?<LoginForm setLoginAction={props.setLoginAction} loading={loading} setLoading={setLoading}/>:null}
                {props.action === "register"?<RegisterForm keyPressed={keyPressed} loading={loading} setLoading={setLoading} registerCard={registerCard} registerValidation={registerValidation} setRegisterValidation={setRegisterValidation} setCard={setCard}/>:null}

                {props.action === "register" && !loading?<div className={styles.registerBtns}>
                    <button disabled={registerCard === 0} className={`${styles.registerBtn} ${registerCard === 0 ? styles.btnDisabled : null}`} onClick={e=>registerCard > 0 ? changeRegisterCard("desc"):null}>Wstecz</button>
                    <button ref={nextBtn} className={styles.registerBtn} onClick={e=>registerCard != 2?changeRegisterCard("asc"):setRegisterValidation(true)}>Dalej</button>
                </div>:null}

                {props.action === "register" && loading ?<div className={styles.loadingContainer}><Loading /></div>:null}
                {props.action === "register"?<div className={styles.progressBar}>
                    <div className={`${styles.progress} ${loading?styles.progressPos4:(registerCard == 2?styles.progressPos3:(registerCard == 1?styles.progressPos2:styles.progressPos1))}`}></div>
                </div>:null}
            </div>
        </div>
    )
}

export default ShowLogin