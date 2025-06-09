import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function AnimatedText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState(text)

  const [key, setKey] = useState(0)

  useEffect(() => {
    setKey(prev => prev + 1)
    setDisplayText(text)
  }, [text])

  return (
    <AnimatePresence mode='wait'>
      <motion.span
        key={key}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.4,
          scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
        }}
        style={{ display: 'inline-block' }}
        className='font-bold text-5xl'
      >
        {displayText}
      </motion.span>
    </AnimatePresence>
  )
}
