import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export function DatePicker({ selected, setSelected, isRange = false }) {
  const [range, setRange] = useState(null)

  // ! If is range (filtering) and there is already filter -> set initial range
  useEffect(() => {
    if (isRange && selected) setRange({ ...selected })
  }, [])

  useEffect(() => {
    setSelected(range)
  }, [range])

  return (
    <section className="date-picker">
      <DayPicker
        mode={isRange ? 'range' : 'single'}
        onSelect={isRange ? setRange : setSelected}
        selected={isRange ? range : selected}
        showOutsideDays
        style={{
          fontSize: '14px',
          margin: 'auto',
          backgroundColor: '#efefff',
          padding: '10px',
        }}
        modifiersStyles={{
          selected: { backgroundColor: '#3870e8' },
        }}
      />
    </section>
  )
}
