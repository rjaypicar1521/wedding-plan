export interface Guest {
  id: string
  name: string
  email: string
  status: 'invited' | 'confirmed' | 'declined'
}

export interface WeddingDetails {
  partner1Name: string
  partner2Name: string
  weddingDate: Date
  venue: string
}

export interface WeddingState {
  details: WeddingDetails
  guests: Guest[]
}

export type WeddingAction =
  | { type: 'ADD_GUEST'; payload: Omit<Guest, 'id'> }
  | { type: 'UPDATE_GUEST_STATUS'; payload: { id: string; status: Guest['status'] } }
  | { type: 'REMOVE_GUEST'; payload: string }
  | { type: 'UPDATE_WEDDING_DETAILS'; payload: Partial<WeddingDetails> }
