function getMessageDate(time)
{
    const date = new Date(time)
    const today = new Date()
    if(date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear())
    {
        return `${date.getHours()}:${date.getMinutes()<10?'0':''}${date.getMinutes()}`
    }
    else if(date.getFullYear() === today.getFullYear())
    {
        return `${date.getDate()+1 < 10?'0':''}${date.getDate()+1}.${date.getMonth()+1 < 10?'0':''}${date.getMonth()+1} ${date.getHours()}:${date.getMinutes() < 10?'0':''}${date.getMinutes()}`
    }
    else
    {
        return `${date.getDate()+1 < 10?'0':''}${date.getDate()+1}.${date.getMonth()+1 < 10?'0':''}${date.getMonth()+1}.${date.getFullYear()}`
    }
}
export default getMessageDate