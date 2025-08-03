import axios from "axios";
import ApiAddress from "../../ApiAddress";


async function refreshToken()
{
    try
    {
        const response = await axios.post(`${ApiAddress}/refresh-token`,{token:sessionStorage.getItem("refreshToken")})
        sessionStorage.setItem("token",response.data.token)
    }
    catch(ex)
    {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem("refreshToken")
    }
}

export default refreshToken