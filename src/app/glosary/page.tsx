import { Metadata } from 'next'
import { GlossaryContent } from '~/components/glosary-content.component'

export const metadata: Metadata = {
  title: 'Glosario | Minimal Docs Site',
  description: 'Explora términos clave de póker y mejora tu juego',
}

export default function GlossaryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Glosario</h1>
      <p className="text-xl mb-8">
        Aprende los términos más importantes del póker para mejorar tu
        estrategia y comprensión del juego.
      </p>
      <GlossaryContent />
    </div>
  )
}
