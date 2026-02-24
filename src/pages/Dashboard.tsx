import { useState, useEffect } from 'react'

interface CountdownTime {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Dashboard() {
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Set your wedding date here
  const weddingDate = new Date('2025-06-15T14:00:00')

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date()
      const difference = weddingDate.getTime() - now.getTime()

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateCountdown()
    const interval = setInterval(calculateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const stats = [
    { label: 'Total Guests', value: '0', icon: '👥' },
    { label: 'RSVPs Pending', value: '0', icon: '📋' },
    { label: 'Budget Used', value: '0%', icon: '💰' },
    { label: 'Tasks Remaining', value: '0', icon: '✅' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Wedding Planner
          </h1>
          <p className="text-gray-600">Your special day is approaching!</p>
        </header>

        {/* Countdown Timer */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            Countdown to Your Big Day
          </h2>
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { value: countdown.days, label: 'Days' },
              { value: countdown.hours, label: 'Hours' },
              { value: countdown.minutes, label: 'Minutes' },
              { value: countdown.seconds, label: 'Seconds' },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl p-4 text-center"
              >
                <div className="text-4xl font-bold text-pink-600">
                  {item.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{stat.icon}</span>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions Placeholder */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg py-3 px-4 transition-colors">
              Add Guest
            </button>
            <button className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-3 px-4 transition-colors">
              New Task
            </button>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-3 px-4 transition-colors">
              Add Expense
            </button>
            <button className="bg-teal-500 hover:bg-teal-600 text-white rounded-lg py-3 px-4 transition-colors">
              Find Vendor
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
