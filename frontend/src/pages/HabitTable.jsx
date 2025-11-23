import { useState } from 'react'
import Navbar from '../components/Navbar'
import DayCheckbox from '../components/DayCheckbox'
import { useHabits } from '../hooks/useHabits'
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react'

function HabitTable() {
  const { habits, isLoading, createHabit, deleteHabit, trackHabit } = useHabits()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitIcon, setNewHabitIcon] = useState('📝')

  // Get current month dates
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const dates = []
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    dates.push({
      day,
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dateString: date.toISOString().split('T')[0]
    })
  }

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const handleAddHabit = async (e) => {
    e.preventDefault()
    if (!newHabitName.trim()) return

    await createHabit.mutateAsync({
      name: newHabitName,
      icon: newHabitIcon
    })

    setNewHabitName('')
    setNewHabitIcon('📝')
    setShowAddForm(false)
  }

  const handleDeleteHabit = async (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit.mutateAsync(id)
    }
  }

  const handleToggleTracking = async (habitId, date) => {
    await trackHabit.mutateAsync({ id: habitId, date })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Habit Tracker</h1>
            <p className="text-gray-600">{monthName}</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center gap-2"
          >
            {showAddForm ? <X size={18} /> : <Plus size={18} />}
            {showAddForm ? 'Cancel' : 'Add Habit'}
          </button>
        </div>

        {/* Add Habit Form */}
        {showAddForm && (
          <div className="card p-6 mb-6 shadow-lg">
            <form onSubmit={handleAddHabit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-shrink-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <input
                  type="text"
                  value={newHabitIcon}
                  onChange={(e) => setNewHabitIcon(e.target.value)}
                  className="input w-20 text-center text-2xl"
                  maxLength={2}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="input"
                  placeholder="e.g., Morning meditation, Read 30 minutes"
                  autoFocus
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="btn-primary whitespace-nowrap"
                  disabled={!newHabitName.trim()}
                >
                  Add Habit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Habits Table - Desktop View */}
        <div className="hidden md:block card shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="table-cell font-semibold text-gray-700 w-16 sticky left-0 bg-gray-100 z-10">
                    Icon
                  </th>
                  <th className="table-cell font-semibold text-gray-700 text-left min-w-[200px] sticky left-16 bg-gray-100 z-10">
                    Habit Name
                  </th>
                  {dates.map((date) => (
                    <th
                      key={date.dateString}
                      className={`table-cell font-medium text-xs ${
                        date.dateString === today.toISOString().split('T')[0]
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div>{date.weekday}</div>
                        <div className="font-bold">{date.day}</div>
                      </div>
                    </th>
                  ))}
                  <th className="table-cell font-semibold text-gray-700 w-16 sticky right-0 bg-gray-100 z-10">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {habits.length === 0 ? (
                  <tr>
                    <td colSpan={dates.length + 3} className="table-cell text-center py-12 text-gray-500">
                      No habits yet. Click "Add Habit" to get started!
                    </td>
                  </tr>
                ) : (
                  habits.map((habit) => (
                    <tr key={habit._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="table-cell text-center text-2xl sticky left-0 bg-white z-10">
                        {habit.icon}
                      </td>
                      <td className="table-cell font-medium sticky left-16 bg-white z-10">
                        {habit.name}
                      </td>
                      {dates.map((date) => (
                        <DayCheckbox
                          key={date.dateString}
                          habit={habit}
                          date={date.dateString}
                          onToggle={handleToggleTracking}
                        />
                      ))}
                      <td className="table-cell text-center sticky right-0 bg-white z-10">
                        <button
                          onClick={() => handleDeleteHabit(habit._id)}
                          className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                          title="Delete habit"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden space-y-4 pb-20">
          {habits.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No habits yet. Tap "Add Habit" to start!
            </div>
          ) : (
            habits.map((habit) => {
              const todayDate = new Date().toISOString().split('T')[0]
              const isCompletedToday = habit.tracking?.find(t => t.date === todayDate)?.completed

              return (
                <div key={habit._id} className="card p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
                      {habit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                      <p className="text-xs text-gray-500">
                        {isCompletedToday ? 'Completed today' : 'Not completed yet'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <DayCheckbox
                      habit={habit}
                      date={todayDate}
                      onToggle={handleToggleTracking}
                    />
                    <button
                      onClick={() => handleDeleteHabit(habit._id)}
                      className="text-gray-400 hover:text-red-600 p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 border-gray-300 bg-white"></div>
            <span>Not completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 border-green-600 bg-green-500 flex items-center justify-center">
              <Check className="text-white" size={16} strokeWidth={3} />
            </div>
            <span>Completed</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HabitTable
