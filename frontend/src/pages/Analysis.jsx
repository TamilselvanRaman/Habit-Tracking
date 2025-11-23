import { useState } from 'react'
import Navbar from '../components/Navbar'
import WeeklyChart from '../components/WeeklyChart'
import MonthlyChart from '../components/MonthlyChart'
import { useAnalysis } from '../hooks/useAnalysis'
import { useHabits } from '../hooks/useHabits'
import { TrendingUp, TrendingDown, Lightbulb, Award, Target, BarChart3 } from 'lucide-react'

function Analysis() {
  const { autoAnalysis, autoLoading, useWeeklyAnalysis } = useAnalysis()
  const { habits } = useHabits()
  const [selectedHabitId, setSelectedHabitId] = useState(null)
  
  const { data: weeklyData } = useWeeklyAnalysis(selectedHabitId)

  if (autoLoading) {
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Analysis & Insights</h1>
            <p className="text-gray-600">Track your progress and get personalized recommendations</p>
          </div>
          <button 
            onClick={() => {
              const token = localStorage.getItem('token');
              fetch('http://localhost:5000/api/analysis/report', {
                headers: { Authorization: `Bearer ${token}` }
              })
              .then(res => res.blob())
              .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'habit-report.txt';
                a.click();
              })
              .catch(err => console.error('Download failed', err));
            }}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <BarChart3 size={20} />
            Download Report
          </button>
        </div>

        {/* Auto Analysis Cards */}
        {autoAnalysis && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            {/* Most Followed Habit */}
            {autoAnalysis.mostFollowed && (
              <div className="card p-4 md:p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <Award className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Most Followed</h3>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{autoAnalysis.mostFollowed.icon}</span>
                  <p className="text-xl font-semibold text-gray-900">{autoAnalysis.mostFollowed.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-green-600" size={20} />
                  <span className="text-2xl font-bold text-green-600">{autoAnalysis.mostFollowed.percentage}%</span>
                  <span className="text-gray-600">completion</span>
                </div>
              </div>
            )}

            {/* Least Followed Habit */}
            {autoAnalysis.leastFollowed && (
              <div className="card p-4 md:p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center">
                    <Target className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Needs Attention</h3>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{autoAnalysis.leastFollowed.icon}</span>
                  <p className="text-xl font-semibold text-gray-900">{autoAnalysis.leastFollowed.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="text-orange-600" size={20} />
                  <span className="text-2xl font-bold text-orange-600">{autoAnalysis.leastFollowed.percentage}%</span>
                  <span className="text-gray-600">completion</span>
                </div>
              </div>
            )}

            {/* Overall Performance */}
            <div className="card p-4 md:p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Overall</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Average Completion Rate</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary-600">
                  {autoAnalysis.overallPercentage || 0}%
                </span>
              </div>
              <div className="mt-3 bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-primary-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${autoAnalysis.overallPercentage || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Progress Chart */}
        <div className="card p-4 md:p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Weekly Progress</h2>
          
          {habits.length > 0 ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Habit to Analyze
                </label>
                <select
                  value={selectedHabitId || ''}
                  onChange={(e) => setSelectedHabitId(e.target.value)}
                  className="input max-w-md"
                >
                  <option value="">Choose a habit...</option>
                  {habits.map(habit => (
                    <option key={habit._id} value={habit._id}>
                      {habit.icon} {habit.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedHabitId && weeklyData?.weeks ? (
                <div>
                  <p className="text-gray-600 mb-4">
                    Showing 4-week progress for: <span className="font-semibold">{weeklyData.habitName}</span>
                  </p>
                  <WeeklyChart data={weeklyData.weeks} />
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  Select a habit above to view weekly progress
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-12">
              Create some habits first to see progress charts
            </div>
          )}
        </div>

        {/* Monthly Distribution */}
        {autoAnalysis?.allHabits && autoAnalysis.allHabits.length > 0 && (
          <div className="card p-4 md:p-6 mb-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Monthly Habit Distribution</h2>
            <p className="text-gray-600 mb-6">
              Completion percentage for all your habits this month
            </p>
            <MonthlyChart habits={autoAnalysis.allHabits} />
          </div>
        )}

        {/* Personalized Suggestions */}
        {autoAnalysis?.suggestions && autoAnalysis.suggestions.length > 0 && (
          <div className="card p-4 md:p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <Lightbulb className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Personalized Tips</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {autoAnalysis.suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-gray-800 leading-relaxed">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!autoAnalysis || autoAnalysis.message) && (
          <div className="card p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="text-gray-400" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Analysis Available Yet</h3>
            <p className="text-gray-600 mb-6">
              {autoAnalysis?.message || 'Start tracking your habits to see insights and recommendations!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analysis
