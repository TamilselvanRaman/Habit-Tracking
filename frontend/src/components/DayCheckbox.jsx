import { Check } from 'lucide-react'

function DayCheckbox({ habit, date, onToggle }) {
  const entry = habit.tracking?.find(t => t.date === date)
  const isChecked = entry?.completed || false

  const handleClick = () => {
    onToggle(habit._id, date)
  }

  return (
    <td className="checkbox-cell" onClick={handleClick}>
      <div className="flex items-center justify-center">
        <div
          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
            isChecked
              ? 'bg-green-500 border-green-600'
              : 'border-gray-300 hover:border-primary-400'
          }`}
        >
          {isChecked && <Check className="text-white" size={16} strokeWidth={3} />}
        </div>
      </div>
    </td>
  )
}

export default DayCheckbox
