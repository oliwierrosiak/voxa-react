import { useEffect, useState } from 'react'
import TopBar from '../topBar/topBar'
import styles from './chat.module.css'
import Aside from './aside'
import setDisplayAsideInChats from '../helpers/setDisplayAsideInChats'
import ChatContent from './chatContent'
import { useParams } from 'react-router-dom'
import setDocumentTitle from '../helpers/useDocumentTitle'

function Chat()
{
   
    const params = useParams()

    const [displayAside,setDisplayAside] = useState(setDisplayAsideInChats(params.id))

    useEffect(()=>{
        sessionStorage.setItem('displayAside',JSON.stringify(displayAside))
        setDocumentTitle("Czaty")
        if(window.innerWidth <= 425 && displayAside)
        {
            setDocumentTitle("Czaty")
        }
        else if(window .innerWidth <= 425 && !displayAside)
        {
            const lastPage = sessionStorage.getItem('lastPage')
            if(lastPage)
            {
                setDocumentTitle(lastPage)
            }
            else
            {
                setDisplayAside('Czaty')
            }
        }
    },[displayAside])

    return(
        <>
        <TopBar />
        
        <main className={styles.main}>
            <Aside displayAside={displayAside} setDisplayAside={setDisplayAside} />
            <ChatContent displayAside={displayAside} setDisplayAside={setDisplayAside}/>
            
        </main>

        </>
    )
}

export default Chat