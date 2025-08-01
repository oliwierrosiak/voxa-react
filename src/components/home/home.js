import styles from './home.module.css'
import logo from '../../assets/img/voxalogo1.png'
import { useState } from 'react'
import ShowLogin from '../login/showLogin'

function Home(props)
{
    const [showLoginState,setShowLoginState] = useState('')

    const cancelLoginForm = () =>{
        setShowLoginState('')
    }

    return(
        <main className={styles.main}>
            <header className={styles.header}>

                <div className={styles.logo}>
                    <img src={logo}/>
                </div>

                <p className={styles.p}>
                       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dictum nunc sit amet nunc eleifend, id luctus velit accumsan. In et posuere elit. Ut tempor dui ultrices neque volutpat ullamcorper. Pellentesque ornare ante a sem pretium, ac aliquam augue condimentum. Nulla facilisis lacus non magna accumsan, vel mattis mi accumsan. Etiam eu nunc non massa auctor tincidunt. Fusce tempus semper arcu vel bibendum. Vestibulum quis orci commodo sem tempus faucibus. Sed non mauris felis. In convallis ligula non scelerisque laoreet. Etiam pharetra maximus eros, nec mattis urna aliquam at. Mauris at sapien sed massa ornare eleifend et nec lectus. 
                </p>

                <div className={styles.btns}>
                    <button className={`${styles.btn} ${styles.loginBtn}`} onClick={e=>setShowLoginState('login')}>Zaloguj się</button>
                    <div className={styles.loginLine}></div>
                    <button className={`${styles.btn} ${styles.registerBtn}`} onClick={e=>setShowLoginState("register")}>Zarejestruj się</button>
                </div>

                {showLoginState?<ShowLogin action={showLoginState} cancelLoginForm={cancelLoginForm}/>:null}

            </header>
        </main>
    )
}

export default Home