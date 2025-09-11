import { startTransition, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TopBar from "../topBar/topBar"
import styles from './search.module.css'
import Loading2 from "../../assets/svg/loading2"
import refreshToken from "../helpers/refreshToken"
import messageContext from "../context/messageContext"
import axios from "axios"
import ApiAddress from "../../ApiAddress"
import NoneUsers from "../../assets/svg/noneUsers"
import Article from "./article"

function Search()
{
    const params = useParams()

    const navigate = useNavigate()
    const message = useContext(messageContext)

    const [data,setData] = useState({})
    const [loading,setLoading] = useState(true)
  

    const getData = async()=>{
        try
        {
            await refreshToken()
            const response = await axios.get(`${ApiAddress}/search/${params.search}`,{headers:{"Authorization":`Bearer ${sessionStorage.getItem('token')}`}})
            setData(response.data)
            setLoading(false)
        }
        catch(ex)
        {
            message.setContent('Wyszukiwanie nie powidoło się',"error")
            navigate('/')
        }
    }

    useEffect(()=>{
        getData()
    },[params.search])

    return(
        <>
            <TopBar />

            <main className={styles.main}>

            <h1 className={styles.header}>Wyniki wyszukiwania dla frazy "{params.search}":</h1>

            {loading?<div className={styles.loadingContainer}>
                <Loading2 class={styles.loading}/>
            </div>:(data.users === 404 && data.chats === 404?<div className={styles.noneSearch}>
                <NoneUsers class={styles.noneUsersSVG}/>
                <h2 className={styles.noneSearchHeader}>Nie znaleziono żadnych wyników</h2>
            </div>:<>
                {data.users !== 404?<Article users={data.users} chat={false} fullHeight={data.chats === 404}/>:null}
                {data.chats !== 404?<Article users={data.chats} chat={true} fullHeight={data.users === 404} />:null}
            </>)}

            </main>
        </>
    )
}

export default Search