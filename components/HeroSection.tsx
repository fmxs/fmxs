import AIChatCard from './AIChatCard'
import NewsCard from './NewsCard'

export default function HeroSection() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
      {/* AI Chat Card (60%) */}
      <div className="lg:col-span-6">
        <AIChatCard />
      </div>

      {/* News Card (40%) */}
      <div className="lg:col-span-4">
        <NewsCard />
      </div>
    </section>
  )
}