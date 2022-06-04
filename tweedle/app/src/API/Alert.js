import { useEffect,useRef } from 'react'
import { AiOutlineClose } from 'react-icons/ai';

export function Alert({onClose, message}){

    const ref = useRef();
    useEffect(()=>{
        let alertDiv = ref.current;
        alertDiv.animate([
            {transform: 'translateX(100%)'},
            {transform: 'translateX(0)'}
        ],{
            duration: 500,
            iterations: 1,
            fill: "forwards",
            easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"

        })

        let timeoutId = setTimeout(handleClose, 30000);

        return () => clearTimeout(timeoutId);
    },[])

    const handleClose = () => {
        let alertDiv = ref.current;
        let height = alertDiv.clientHeight
        alertDiv.animate([
            {transform: 'translateX(0)'},
            {transform: 'translateX(100%)'},
            {
                padding: "1rem 1rem",
                marginBottom: "0.5rem", 
                height: `${height}px`,
                transform: 'translateX(100%)'
            },
            {
                padding : "0px 1rem",
                marginBottom: "0px",
                height: "0px",
                transform: 'translateX(100%)'
            }
        ],{
            duration: 500,
            iterations: 1,
            fill: "forwards",
        })

        setTimeout(onClose, 600);
    }

    return(
        <div ref={ref} className='flex items-center
        bg-accent gap-4 p-4 rounded-lg translate-x-full max-w-full ml-5 md:w-fit mb-2'>
            <p className='flex-1'>{message}</p>
            <AiOutlineClose onClick={handleClose} className='cursor-pointer'/>
        </div>
    )
}