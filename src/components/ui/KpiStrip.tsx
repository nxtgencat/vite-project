import type { ReactNode } from 'react'

export type KpiItem = {
  label: string
  value: ReactNode
  meta?: ReactNode
}

export function KpiStrip({ items, label }: { items: KpiItem[]; label: string }) {
  return (
    <section className="kpi-strip" aria-label={label}>
      {items.map((item) => (
        <div className="kpi-cell" key={item.label}>
          <p className="kpi-label">{item.label}</p>
          <p className="kpi-value num">{item.value}</p>
          {item.meta && <p className="kpi-meta">{item.meta}</p>}
        </div>
      ))}
    </section>
  )
}
