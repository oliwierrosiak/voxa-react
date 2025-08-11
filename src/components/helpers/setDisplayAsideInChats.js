function setDisplayAsideInChats()
{
    try
    {
        const storage = JSON.parse(sessionStorage.getItem('displayAside'))
        if(storage === false || storage === true)
        {
            return storage
        }
        else
        {
            throw new Error()
        }
        
    }
    catch(ex)
    {
        sessionStorage.setItem("displayAside",JSON.stringify(true))
        return true
    }
}

export default setDisplayAsideInChats