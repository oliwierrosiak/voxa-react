function getMessageDuration(showDuration,dur)
{
    const duration = Math.round(dur)
    const showDurationRounded = Math.round(showDuration)
    return `${Math.floor(showDurationRounded/60)}:${showDurationRounded % 60 <10?"0":''}${showDurationRounded % 60}/${Math.floor(duration/60)}:${duration % 60 <10?"0":''}${duration % 60}`
}

export default getMessageDuration