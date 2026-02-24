export interface Guest {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  rsvpStatus: 'pending' | 'attending' | 'declined'
  dietaryRestrictions?: string[]
  plusOne?: boolean
  tableAssignment?: string
}

export interface BudgetItem {
  id: string
  name: string
  category: string
  estimatedCost: number
  actualCost?: number
  paid: boolean
  dueDate?: string
  notes?: string
}

export interface Vendor {
  id: string
  name: string
  category: string
  contactPerson?: string
  email?: string
  phone?: string
  contractSigned: boolean
  totalCost: number
  depositPaid: boolean
  notes?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category?: string
}
