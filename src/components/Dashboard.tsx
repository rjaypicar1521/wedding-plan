import { useWedding } from '../stores/WeddingContext'
import { useMemo } from 'react'

export function Dashboard() {
  const { state } = useWedding()
  const { details, guests } = state

  const countdown = useMemo(() => {
    const now = new Date()
    const weddingDate = new Date(details.weddingDate)
    const diffTime = weddingDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }, [details.weddingDate])

  const guestStats = useMemo(() => {
    const confirmed = guests.filter((g) => g.status === 'confirmed').length
    const invited = guests.filter((g) => g.status === 'invited').length
    const declined = guests.filter((g) => g.status === 'declined').length
    return { confirmed, invited, declined, total: guests.length }
  }, [guests])

  return (
    <div className="dashboard">
      <h1 className="wedding-title">
        {details.partner1Name} & {details.partner2Name}'s Wedding
      </h1>
      
      <div className="countdown-card">
        <h2>Countdown to the Big Day</h2>
        <div className="countdown-number">{countdown}</div>
        <p>days to go!</p>
        <p className="wedding-date">
          {new Date(details.weddingDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p className="venue">📍 {details.venue}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Guests</h3>
          <span className="stat-number">{guestStats.total}</span>
        </div>
        <div className="stat-card confirmed">
          <h3>Confirmed</h3>
          <span className="stat-number">{guestStats.confirmed}</span>
        </div>
        <div className="stat-card invited">
          <h3>Pending</h3>
          <span className="stat-number">{guestStats.invited}</span>
        </div>
        <div className="stat-card declined">
          <h3>Declined</h3>
          <span className="stat-number">{guestStats.declined}</span>
        </div>
      </div>
    </div>
  )
}
