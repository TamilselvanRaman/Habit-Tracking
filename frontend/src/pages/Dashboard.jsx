import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useHabits } from '../hooks/useHabits'
import { Table, BarChart3, TrendingUp, Target, Plus } from 'lucide-react'

function Dashboard() {
  const { habits, isLoading } = useHabits()

  const today = new Date().toISOString().split('T')[0]
  
  const todayCompleted = habits.filter(habit => {
    const todayEntry = habit.tracking?.find(t => t.date === today)
    return todayEntry?.completed
  }).length

  const completionRate = habits.length > 0 
    ? Math.round((todayCompleted / habits.length) * 100) 
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your habit tracking overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="card p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Target className="text-primary-600" size={24} />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Total Habits</p>
            <p className="text-3xl font-bold text-gray-900">{habits.length}</p>
          </div>

          <div className="card p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Completed Today</p>
            <p className="text-3xl font-bold text-gray-900">{todayCompleted}</p>
          </div>

          <div className="card p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="text-purple-600" size={24} />
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-1">Today's Progress</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <Link 
            to="/habits" 
            className="card p-6 md:p-8 hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Table className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Habit Table</h3>
                <p className="text-gray-600">Track your daily habits with checkboxes</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-primary-600 font-medium">
              Go to Habit Table
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          <Link 
            to="/analysis" 
            className="card p-6 md:p-8 hover:shadow-lg transition-all hover:scale-105 group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Analysis & Insights</h3>
                <p className="text-gray-600">View your progress and get personalized tips</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-purple-600 font-medium">
              View Analysis
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>

        {/* Quick Start Guide */}
        {habits.length === 0 && (
          <div className="mt-8 card p-8 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Plus className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Get Started!</h3>
                <p className="text-gray-700 mb-4">
                  You haven't created any habits yet. Start building better habits today!
                </p>
                <Link to="/habits" className="btn-primary inline-flex items-center gap-2">
                  <Plus size={18} />
                  Create Your First Habit
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
