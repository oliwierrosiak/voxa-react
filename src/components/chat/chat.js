import { useState } from 'react'
import TopBar from '../topBar/topBar'
import styles from './chat.module.css'
import Aside from './aside'

function Chat()
{
    const [displayAside,setDisplayAside] = useState(true)

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