import { useEffect } from 'react'

export interface ToastProps {
    message: string
    onClose: () => void
    type?: 'success' | 'error'
}

const Toast = ({ message, onClose, type = 'success' }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-md text-white text-sm
      ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {message}
        </div>
    )
}

export default Toast
