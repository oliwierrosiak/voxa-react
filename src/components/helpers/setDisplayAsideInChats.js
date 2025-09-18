function setDisplayAsideInChats(param)
{
    if(!param && window.innerWidth <= 425)
    {

        sessionStorage.setItem("displayAside",JSON.stringify(true))
        return true
    }
    else if(param && window.innerWidth <= 425)
    {
        sessionStorage.setItem("displayAside",JSON.stringify(false))
        return false

    }
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