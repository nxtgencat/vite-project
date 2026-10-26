export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading the page">
      <div className="mb-5">
        <div className="skeleton" style={{ width: 180, height: 24 }} />
        <div className="skeleton mt-3" style={{ width: 320, maxWidth: '80%', height: 14 }} />
      </div>
      <div className="kpi-strip" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="kpi-cell" key={index}>
            <div className="skeleton" style={{ width: 68, height: 12 }} />
            <div className="skeleton mt-3" style={{ width: 44, height: 28 }} />
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-12">
        <div className="panel panel-pad xl:col-span-8">
          <div className="skeleton" style={{ width: 150, height: 16 }} />
          <div className="skeleton mt-4" style={{ width: '100%', height: 76 }} />
          <div className="skeleton mt-4" style={{ width: '100%', height: 112 }} />
        </div>
        <div className="panel panel-pad xl:col-span-4">
          <div className="skeleton" style={{ width: 110, height: 16 }} />
          <div className="skeleton mt-4" style={{ width: '100%', height: 36 }} />
          <div className="skeleton mt-2" style={{ width: '100%', height: 36 }} />
          <div className="skeleton mt-2" style={{ width: '100%', height: 36 }} />
        </div>
      </div>
    </div>
  )
}
