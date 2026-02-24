import { createContext, useContext, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { Guest, WeddingDetails, WeddingState, WeddingAction } from '../types/wedding'

const generateId = (): string => Math.random().toString(36).substring(2, 9)

const initialState: WeddingState = {
  details: {
    partner1Name: 'Alex',
    partner2Name: 'Jordan',
    weddingDate: new Date('2026-06-15'),
    venue: 'Grand Ballroom',
  },
  guests: [
    { id: '1', name: 'John Smith', email: 'john@example.com', status: 'confirmed' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com', status: 'invited' },
  ],
}

function weddingReducer(state: WeddingState, action: WeddingAction): WeddingState {
  switch (action.type) {
    case 'ADD_GUEST':
      return {
        ...state,
        guests: [...state.guests, { ...action.payload, id: generateId() }],
      }
    case 'UPDATE_GUEST_STATUS':
      return {
        ...state,
        guests: state.guests.map((guest) =>
          guest.id === action.payload.id
            ? { ...guest, status: action.payload.status }
            : guest
        ),
      }
    case 'REMOVE_GUEST':
      return {
        ...state,
        guests: state.guests.filter((guest) => guest.id !== action.payload),
      }
    case 'UPDATE_WEDDING_DETAILS':
      return {
        ...state,
        details: { ...state.details, ...action.payload },
      }
    default:
      return state
  }
}

interface WeddingContextType {
  state: WeddingState
  dispatch: React.Dispatch<WeddingAction>
  addGuest: (guest: Omit<Guest, 'id'>) => void
  updateGuestStatus: (id: string, status: Guest['status']) => void
  removeGuest: (id: string) => void
  updateWeddingDetails: (details: Partial<WeddingDetails>) => void
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined)

interface WeddingProviderProps {
  children: ReactNode
}

export function WeddingProvider({ children }: WeddingProviderProps) {
  const [state, dispatch] = useReducer(weddingReducer, initialState)

  const addGuest = (guest: Omit<Guest, 'id'>) => {
    dispatch({ type: 'ADD_GUEST', payload: guest })
  }

  const updateGuestStatus = (id: string, status: Guest['status']) => {
    dispatch({ type: 'UPDATE_GUEST_STATUS', payload: { id, status } })
  }

  const removeGuest = (id: string) => {
    dispatch({ type: 'REMOVE_GUEST', payload: id })
  }

  const updateWeddingDetails = (details: Partial<WeddingDetails>) => {
    dispatch({ type: 'UPDATE_WEDDING_DETAILS', payload: details })
  }

  return (
    <WeddingContext.Provider
      value={{ state, dispatch, addGuest, updateGuestStatus, removeGuest, updateWeddingDetails }}
    >
      {children}
    </WeddingContext.Provider>
  )
}

export function useWedding(): WeddingContextType {
  const context = useContext(WeddingContext)
  if (context === undefined) {
    throw new Error('useWedding must be used within a WeddingProvider')
  }
  return context
}
