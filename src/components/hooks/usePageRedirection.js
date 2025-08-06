// import { useNavigate } from "react-router-dom"

// function usePageRedirection()
// {
//     const navigation = useNavigate()
//     const setPage = (val) =>
//     {
//         if(val !== '/')
//         {
//             sessionStorage.setItem('prevPage',val)
//         }
//     }
//     const redirect = () =>{
//         const prevPage = sessionStorage.getItem("prevPage");

//         // przekierowuj tylko jeśli jest inna ścieżka niż '/'
//         if (prevPage && prevPage !== '/') {
//             navigation(prevPage, { replace: true });
//         }
//     }




//     return [setPage,redirect]
// }

// export default usePageRedirection