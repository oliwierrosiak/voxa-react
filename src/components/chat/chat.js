import { useEffect, useState } from 'react'
import TopBar from '../topBar/topBar'
import styles from './chat.module.css'
import Aside from './aside'
import setDisplayAsideInChats from '../helpers/setDisplayAsideInChats'

function Chat()
{
   

    const [displayAside,setDisplayAside] = useState(setDisplayAsideInChats())

    useEffect(()=>{
        sessionStorage.setItem('displayAside',JSON.stringify(displayAside))
    },[displayAside])

    return(
        <>
        <TopBar />
        
        <main className={styles.main}>
            <Aside displayAside={displayAside} setDisplayAside={setDisplayAside} />
            <article className={`${styles.chat} ${displayAside?styles.chatReduced:''}`}></article>
        </main>

        </>
    )
}

export default Chat