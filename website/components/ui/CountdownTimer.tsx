'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getNextSunday(): Date {
  const now = new Date()
  const day = now.getDay() // 0 = Sunday
  const target = new Date(now)

  if (day === 0) {
    target.setHours(23, 59, 0, 0)
    if (now >= target) {
      target.setDate(target.getDate() + 7)
      target.setHours(23, 59, 0, 0)
    }
  } else {
    target.setDate(now.getDate() + (7 - day))
    target.setHours(23, 59, 0, 0)
  }

  return target
}

function calcTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now())
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-4xl font-bold tracking-tight tabular-nums text-white">
        {pad(value)}
      </span>
      <span className="text-sm text-white/50">{label}</span>
    </div>
  )
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const target = getNextSunday()
    const update = () => setTimeLeft(calcTimeLeft(target))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center justify-center gap-4 font-mono">
      <TimeUnit value={timeLeft.days} label="d" />
      <span className="text-3xl font-light text-white/20">:</span>
      <TimeUnit value={timeLeft.hours} label="h" />
      <span className="text-3xl font-light text-white/20">:</span>
      <TimeUnit value={timeLeft.minutes} label="m" />
      <span className="text-3xl font-light text-white/20">:</span>
      <TimeUnit value={timeLeft.seconds} label="s" />
    </div>
  )
}
