import styles from './login.module.css'
import logo from '../../assets/img/voxalogo1.png'
import LoginForm from './loginForm'
import RegisterForm from './registerForm'

function ShowLogin(props)
{   

    const hideLoginForm = (e) =>{
        if(e.target.classList.contains(styles.loginContainer))
        {
            props.cancelLoginForm()

        }
    }

    return(
        <div className={styles.loginContainer} onClick={hideLoginForm}>
            <div className={styles.login}>
                <img src={logo} className={styles.logo}/>
                {props.action === "login"?<LoginForm />:null}
                {props.action === "register"?<RegisterForm />:null}
            </div>
        </div>
    )
}

export default ShowLogin