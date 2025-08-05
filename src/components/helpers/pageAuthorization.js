import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import LoginContext from "../context/loginContext"

function PageAuthorization()
{
    const logged = useContext(LoginContext)
    const navigation = useNavigate()

    useEffect(()=>{
        if(!logged.logged)
        {
            navigation('/')
        }
    },)

    return(
        <></>
    )
}

export default PageAuthorization