import styles from './home.module.css'
import logo from '../../assets/img/voxalogo1.png'
import { useState } from 'react'
import ShowLogin from '../login/showLogin'

function Home(props)
{
  

    const cancelLoginForm = () =>{
        props.setShowLoginState('')
    }

    const setLoginAction = (action) =>
    {
        props.setShowLoginState(action)
    }

    return(
        <main className={styles.main}>
            <header className={styles.header}>

                <div className={styles.logo}>
                    <img src={logo}/>
                </div>

                <p className={styles.p}>
                      Wiatamy w serwisie Voxa! Voxa to nowoczesny komunikator internetowy, służący do czatowania, wymiany informacji, zdjęć plików czy wiadomości głosowych. Stworzyliśmy go z myślą o ludziach, którzy cenią sobie szybkość, prostotę i bezpieczeństwo w codziennej wymianie informacji.
                </p>

                <p className={styles.p}>
                      Zarejestruj się bezpłatnie już teraz i korzystaj z możliwości naszego serwisu! Wyszukuj, przeglądaj, pozwaj i dodawaj nowe osoby, rozpoczynaj konwersajce i ciesz się chwilą spędzoną wspólnie ze swoimi znajomymi na czatach online.
                </p>

                <div className={styles.btns}>
                    <button className={`${styles.btn} ${styles.loginBtn}`} onClick={e=>props.setShowLoginState('login')}>Zaloguj się</button>
                    <div className={styles.loginLine}></div>
                    <button className={`${styles.btn} ${styles.registerBtn}`} onClick={e=>props.setShowLoginState("register")}>Zarejestruj się</button>
                </div>

                {props.showLoginState?<ShowLogin action={props.showLoginState} cancelLoginForm={cancelLoginForm} setLoginAction={setLoginAction}/>:null}

            </header>
        </main>
    )
}

export default Home