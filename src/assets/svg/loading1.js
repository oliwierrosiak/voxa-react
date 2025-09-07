function Loading1(props)
{
    return(
        <svg className={props.class?props.class:''} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="1.6rem" height="1.6rem" style={{"shapeRendering": "auto", "display": "block", "background": "transparent"}}><g><circle strokeDasharray="183.7831702350029 63.261056745000964" r="39" strokeWidth="10" stroke="#010b40" fill="none" cy="50" cx="50">
  <animateTransform keyTimes="0;1" values="0 50 50;360 50 50" dur="0.9523809523809523s" repeatCount="indefinite" type="rotate" attributeName="transform"/>
</circle><g/></g></svg>
    )
}

export default Loading1