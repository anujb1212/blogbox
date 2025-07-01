import Toast from './Toast'

interface Props {
    message: string
    type: 'success' | 'error'
    onClose: () => void
}

const ToastRenderer = ({ message, type, onClose }: Props) => {
    if (!message) return null

    return <Toast message={message} type={type} onClose={onClose} />
}

export default ToastRenderer
