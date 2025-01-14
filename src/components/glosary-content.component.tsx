'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { ArrowUp, Search, Volume2 } from 'lucide-react'
import { terms } from '~/const/terms.const'

export function GlossaryContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredTerms, setFilteredTerms] = useState(terms)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const voices = window.speechSynthesis.getVoices()
    console.log('Voces disponibles:', voices)
  }, [])

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value
      setSearchTerm(value)
      const filtered = terms.filter(
        (term) =>
          term.title.toLowerCase().includes(value.toLowerCase()) ||
          term.description.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredTerms(filtered)
    },
    [],
  )

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const readText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)

    utterance.lang = 'es-ES'
    utterance.pitch = 1.1
    utterance.rate = 1.0
    utterance.volume = 0.8

    const voices = window.speechSynthesis.getVoices()
    const selectedVoice = voices.find(
      (voice) => voice.name.includes('Google') && voice.lang === 'es-ES',
    )
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }

    window.speechSynthesis.speak(utterance)
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div className="mb-8 relative">
        <Input
          type="text"
          placeholder="Buscar términos..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10"
          aria-label="Buscar términos"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredTerms.map((term, index) => (
            <motion.div
              key={term.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-card rounded-lg p-6 shadow-md relative"
            >
              <h2 className="text-2xl font-semibold mb-2">{term.title}</h2>
              <p className="text-card-foreground mb-4">{term.description}</p>
              <Button
                onClick={() => readText(`${term.title}: ${term.description}`)}
                aria-label="Leer término"
                className="absolute top-4 right-4 flex items-center justify-center"
              >
                <Volume2 size={20} />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {filteredTerms.length === 0 && (
        <p className="text-center text-xl mt-8">
          No se encontraron términos que coincidan con tu búsqueda.
        </p>
      )}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 right-8"
          >
            <Button
              onClick={scrollToTop}
              aria-label="Volver arriba"
              className="rounded-full w-12 h-12 flex items-center justify-center"
            >
              <ArrowUp size={24} />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
