import { useEffect, useRef, useState } from 'react'
import { eventBus as eventBusService } from '../../services/event-bus.service'

export function UserMsg() {
  const [msg, setMsg] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const timeoutIdRef = useRef()

  useEffect(() => {
    const unsubscribe = eventBusService.on('show-user-msg', msg => {
      setMsg(msg)
      setIsOpen(true)

      if (timeoutIdRef.current) {
        timeoutIdRef.current = null
        clearTimeout(timeoutIdRef.current)
      }
      timeoutIdRef.current = setTimeout(closeMsg, 3000)
    })
    return unsubscribe
  }, [])

  function closeMsg() {
    setIsOpen(false)
    setTimeout(() => setMsg(null), 1000)
  }

  const animationClass = isOpen
    ? 'animate__animated animate__fadeInDown'
    : 'animate__animated animate__fadeOutUp'

  if (!msg) return <span></span>
  return (
    <section className={`user-msg ${msg.type} ${animationClass} flex align-center`}>
      <span>{msg.txt}</span>
      <button className="btn-close-msg" onClick={closeMsg}></button>
    </section>
  )
}
