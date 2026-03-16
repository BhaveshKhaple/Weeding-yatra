import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface DirectoryFilters {
  city: string | null
  dateFrom: string | null
  dateTo: string | null
}

interface DirectoryFiltersProps {
  cities: string[]
  filters: DirectoryFilters
  onFilterChange: (filters: DirectoryFilters) => void
}

type DatePreset = 'all' | 'this_month' | 'next_3_months' | 'custom'

export function DirectoryFilterBar({ cities, filters, onFilterChange }: DirectoryFiltersProps) {
  const [activeDatePreset, setActiveDatePreset] = useState<DatePreset>('all')

  // Automatically sync preset state if external filters clear the dates
  useEffect(() => {
    if (!filters.dateFrom && !filters.dateTo) {
      setActiveDatePreset('all')
    }
  }, [filters.dateFrom, filters.dateTo])

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    onFilterChange({ ...filters, city: val === 'all' ? null : val })
  }

  const applyDatePreset = (preset: DatePreset) => {
    setActiveDatePreset(preset)
    const now = new Date()

    if (preset === 'all') {
      onFilterChange({ ...filters, dateFrom: null, dateTo: null })
      return
    }

    if (preset === 'this_month') {
      const from = new Date(now.getFullYear(), now.getMonth(), 1)
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      onFilterChange({
        ...filters,
        dateFrom: from.toISOString().split('T')[0],
        dateTo: to.toISOString().split('T')[0]
      })
      return
    }

    if (preset === 'next_3_months') {
      const to = new Date(now.getFullYear(), now.getMonth() + 3, 0)
      onFilterChange({
        ...filters,
        dateFrom: now.toISOString().split('T')[0],
        dateTo: to.toISOString().split('T')[0]
      })
      return
    }
  }

  const handleCustomDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    onFilterChange({
      ...filters,
      [field]: value || null
    })
  }

  const clearFilter = (type: 'city' | 'date') => {
    if (type === 'city') onFilterChange({ ...filters, city: null })
    if (type === 'date') onFilterChange({ ...filters, dateFrom: null, dateTo: null })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-20 w-full bg-charcoal/80 supports-[backdrop-filter]:bg-charcoal/60 backdrop-blur-xl border-b border-white/10 shadow-lg py-4 mb-8"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-4">
        
        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl text-turmeric hidden md:block">Filter By:</h2>
            
            <div className="relative">
              <select
                value={filters.city || 'all'}
                onChange={handleCityChange}
                className="appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-ivory/90 text-sm font-sans pr-10 focus:outline-none focus:border-turmeric/50 transition-colors placeholder:text-ivory/30"
              >
                <option value="all" className="bg-charcoal text-ivory">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city} className="bg-charcoal text-ivory">
                    {city}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-xs">
                ▼
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PresetButton 
              active={activeDatePreset === 'all'} 
              onClick={() => applyDatePreset('all')}
            >
              All Dates
            </PresetButton>
            <PresetButton 
              active={activeDatePreset === 'this_month'} 
              onClick={() => applyDatePreset('this_month')}
            >
              This Month
            </PresetButton>
            <PresetButton 
              active={activeDatePreset === 'next_3_months'} 
              onClick={() => applyDatePreset('next_3_months')}
            >
              Next 3 Months
            </PresetButton>
            <PresetButton 
              active={activeDatePreset === 'custom'} 
              onClick={() => applyDatePreset('custom')}
            >
              Custom Range
            </PresetButton>
          </div>
        </div>

        {/* Custom Date Inputs & Active Pills Row */}
        <AnimatePresence>
          {(activeDatePreset === 'custom' || filters.city || filters.dateFrom || filters.dateTo) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 overflow-hidden pt-2 border-t border-white/5"
            >
              <div className="flex flex-wrap items-center gap-4">
                {activeDatePreset === 'custom' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) => handleCustomDateChange('dateFrom', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-ivory focus:outline-none focus:border-turmeric/50 color-scheme-dark"
                      style={{ colorScheme: 'dark' }}
                    />
                    <span className="text-white/30 text-xs">—</span>
                    <input
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) => handleCustomDateChange('dateTo', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-ivory focus:outline-none focus:border-turmeric/50"
                      style={{ colorScheme: 'dark' }}
                    />
                  </div>
                )}
              </div>

              {/* Active Filter Pills */}
              <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
                <AnimatePresence>
                  {filters.city && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-1 bg-turmeric/10 border border-turmeric/20 text-turmeric px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {filters.city}
                      <button onClick={() => clearFilter('city')} className="ml-1 hover:text-white transition-colors">
                        ✕
                      </button>
                    </motion.div>
                  )}
                  {(filters.dateFrom || filters.dateTo) && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="flex items-center gap-1 bg-saffron/10 border border-saffron/20 text-saffron px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {filters.dateFrom ? new Date(filters.dateFrom).toLocaleDateString(undefined, { month: 'short', day: 'numeric'}) : 'Any'} 
                      {' -> '} 
                      {filters.dateTo ? new Date(filters.dateTo).toLocaleDateString(undefined, { month: 'short', day: 'numeric'}) : 'Any'}
                      <button onClick={() => clearFilter('date')} className="ml-1 hover:text-white transition-colors">
                        ✕
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.div>
  )
}

function PresetButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
        active 
          ? 'bg-saffron/20 border-saffron/40 text-turmeric shadow-[0_0_10px_rgba(255,107,0,0.1)]' 
          : 'bg-white/5 border-white/10 text-ivory/60 hover:bg-white/10 hover:text-ivory'
      }`}
    >
      {children}
    </button>
  )
}
