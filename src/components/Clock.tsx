import { useEffect, useState } from 'react'

const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })

export default function Clock({ className = '' }: { className?: string }) {
  const [now, setNow] = useState(() => fmt.format(new Date()))
  useEffect(() => {
    const id = setInterval(() => setNow(fmt.format(new Date())), 1000)
    return () => clearInterval(id)
  }, [])
  return <span className={`tabular-nums ${className}`}>{now} IST</span>
}
