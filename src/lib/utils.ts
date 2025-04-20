import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const secondsRemainder = Math.round(seconds) % 60
  const paddedSeconds = `0${secondsRemainder}`.slice(-2)
  return `${minutes}:${paddedSeconds}`
}

export const exportJSON = (data: any, filename = 'data.json') => {
  const jsonStr = JSON.stringify(data, null, 2) // formatted JSON
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  // Create a temporary anchor element to trigger download
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()

  // Cleanup
  URL.revokeObjectURL(url)
}
