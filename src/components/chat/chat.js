import { useEffect, useState } from 'react'
import TopBar from '../topBar/topBar'
import styles from './chat.module.css'
import Aside from './aside'
import setDisplayAsideInChats from '../helpers/setDisplayAsideInChats'
import ChatContent from './chatContent'

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
            <ChatContent displayAside={displayAside}/>
            
        </main>

        </>
    )
}

export default Chat