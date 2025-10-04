import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function NotFound()
{
    const navigate = useNavigate()
    useEffect(()=>{
        navigate('/')
    },[])
    return(<></>)
}

export default NotFound