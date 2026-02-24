import { useState } from 'react'
import type { FormEvent } from 'react'
import { useWedding } from '../stores/WeddingContext'
import type { Guest } from '../types/wedding'

export function GuestList() {
  const { state, addGuest, updateGuestStatus, removeGuest } = useWedding()
  const [newGuestName, setNewGuestName] = useState('')
  const [newGuestEmail, setNewGuestEmail] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newGuestName.trim() && newGuestEmail.trim()) {
      addGuest({
        name: newGuestName.trim(),
        email: newGuestEmail.trim(),
        status: 'invited',
      })
      setNewGuestName('')
      setNewGuestEmail('')
    }
  }

  const getStatusClass = (status: Guest['status']): string => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed'
      case 'declined':
        return 'status-declined'
      default:
        return 'status-invited'
    }
  }

  return (
    <div className="guest-list">
      <h2>Guest List</h2>
      
      <form onSubmit={handleSubmit} className="add-guest-form">
        <input
          type="text"
          placeholder="Guest name"
          value={newGuestName}
          onChange={(e) => setNewGuestName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email address"
          value={newGuestEmail}
          onChange={(e) => setNewGuestEmail(e.target.value)}
          required
        />
        <button type="submit">Add Guest</button>
      </form>

      <div className="guests-container">
        {state.guests.length === 0 ? (
          <p className="no-guests">No guests added yet. Add your first guest above!</p>
        ) : (
          <ul className="guest-items">
            {state.guests.map((guest) => (
              <li key={guest.id} className="guest-item">
                <div className="guest-info">
                  <span className="guest-name">{guest.name}</span>
                  <span className="guest-email">{guest.email}</span>
                </div>
                <div className="guest-actions">
                  <select
                    value={guest.status}
                    onChange={(e) => updateGuestStatus(guest.id, e.target.value as Guest['status'])}
                    className={`status-select ${getStatusClass(guest.status)}`}
                  >
                    <option value="invited">Invited</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="declined">Declined</option>
                  </select>
                  <button
                    onClick={() => removeGuest(guest.id)}
                    className="remove-btn"
                    aria-label={`Remove ${guest.name}`}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
