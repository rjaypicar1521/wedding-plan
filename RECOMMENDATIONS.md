# Elysian Wedding Planner - Architecture Recommendations & Specification

> **Document Version:** 1.0  
> **Last Updated:** February 24, 2026  
> **Status:** Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Tech Stack](#tech-stack)
3. [Current State Analysis](#current-state-analysis)
4. [Recommended Architecture](#recommended-architecture)
5. [Implementation Plan](#implementation-plan)
6. [Data Models & Schemas](#data-models--schemas)
7. [State Management](#state-management)
8. [Component Structure](#component-structure)
9. [Testing Strategy](#testing-strategy)
10. [Getting Started Guide](#getting-started-guide)

---

## Executive Summary

Elysian Wedding Planner is a modern, type-safe React application designed to help couples plan their perfect wedding. This document outlines the complete architecture recommendations for building a scalable, maintainable, and testable wedding planning application.

The application will feature:
- **Guest List Management** - Track invitations, RSVPs, and dietary requirements
- **Event Timeline** - Visual timeline of wedding day events
- **Vendor Management** - Manage contracts, payments, and communications
- **Budget Tracker** - Monitor expenses and stay within budget
- **Task Manager** - Keep track of to-dos and deadlines
- **Master Dossier** - Central hub for all wedding information

---

## Tech Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI Framework |
| **TypeScript** | 5.9.3 | Type Safety |
| **Vite** | 7.3.1 | Build Tool & Dev Server |

### State Management & Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | 5.0.11 | Global State Management |
| **Zod** | 4.3.6 | Runtime Schema Validation |

### Testing

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vitest** | 4.0.18 | Unit Testing Framework |
| **Testing Library** | 16.3.2 | React Component Testing |
| **@testing-library/jest-dom** | 6.9.1 | DOM Matchers |
| **jsdom** | 28.1.0 | DOM Simulation |

### Code Quality

| Technology | Purpose |
|------------|---------|
| **ESLint** | Code Linting |
| **TypeScript ESLint** | TypeScript-specific Rules |
| **Prettier** | Code Formatting (recommended) |

---

## Current State Analysis

### Project Status

The project is a **freshly scaffolded Vite + React + TypeScript application** with the foundation in place but no wedding planner features implemented yet.

### What's Ready ✅

- [x] Vite build configuration
- [x] TypeScript configuration (strict mode)
- [x] ESLint configuration
- [x] Vitest test setup with jsdom
- [x] Testing Library configured
- [x] Core dependencies installed (React, Zustand, Zod)

### What's Missing ❌

- [ ] No wedding planner features implemented
- [ ] Zustand installed but no stores created (placeholder in `src/stores/`)
- [ ] Zod installed but no schemas defined (placeholder in `src/schemas/`)
- [ ] No custom hooks implemented
- [ ] No page components created
- [ ] No routing configured

### Current Folder Structure

```
src/
├── assets/          # Static assets (images, icons)
├── components/      # UI components (empty - .gitkeep only)
├── hooks/           # Custom hooks (empty - .gitkeep only)
├── pages/           # Page components (empty - .gitkeep only)
├── schemas/         # Zod schemas (empty - .gitkeep only)
├── specs/           # Test specs (empty - .gitkeep only)
├── stores/          # Zustand stores (empty - .gitkeep only)
├── test/            # Test utilities
│   └── setup.ts     # Vitest setup file
├── types/           # TypeScript types (empty - .gitkeep only)
├── utils/           # Helper functions (empty - .gitkeep only)
├── App.css          # App-level styles
├── App.tsx          # Root component
├── index.css        # Global styles
└── main.tsx         # Application entry point
```

---

## Recommended Architecture

### Folder Structure (Enhanced)

```
src/
├── assets/
│   ├── icons/           # SVG icons
│   ├── images/          # Static images
│   └── fonts/           # Custom fonts (if needed)
│
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Card/
│   │   └── Table/
│   ├── layout/          # Layout components
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── Footer/
│   │   └── PageLayout/
│   ├── features/        # Feature-specific components
│   │   ├── GuestList/
│   │   ├── Timeline/
│   │   ├── Budget/
│   │   ├── Vendors/
│   │   └── Tasks/
│   └── index.ts         # Barrel exports
│
├── hooks/
│   ├── useGuests.ts
│   ├── useVendors.ts
│   ├── useBudget.ts
│   ├── useTasks.ts
│   ├── useTimeline.ts
│   └── index.ts
│
├── pages/
│   ├── Dashboard/
│   │   └── Dashboard.tsx
│   ├── GuestList/
│   │   └── GuestList.tsx
│   ├── MasterDossier/
│   │   └── MasterDossier.tsx
│   ├── Vendors/
│   │   └── Vendors.tsx
│   ├── Budget/
│   │   └── Budget.tsx
│   ├── Timeline/
│   │   └── Timeline.tsx
│   ├── Tasks/
│   │   └── Tasks.tsx
│   └── index.ts
│
├── schemas/
│   ├── guest.schema.ts
│   ├── event.schema.ts
│   ├── vendor.schema.ts
│   ├── budget.schema.ts
│   ├── task.schema.ts
│   ├── timeline.schema.ts
│   └── index.ts
│
├── stores/
│   ├── guestListStore.ts
│   ├── eventStore.ts
│   ├── vendorStore.ts
│   ├── budgetStore.ts
│   ├── taskStore.ts
│   ├── uiStore.ts
│   └── index.ts
│
├── types/
│   ├── guest.types.ts
│   ├── event.types.ts
│   ├── vendor.types.ts
│   ├── budget.types.ts
│   ├── task.types.ts
│   ├── timeline.types.ts
│   └── index.ts
│
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   ├── constants.ts
│   ├── helpers.ts
│   └── index.ts
│
├── test/
│   ├── setup.ts
│   ├── testUtils.tsx
│   └── mocks/
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## Implementation Plan

### Phase 1: Foundation (Week 1)

#### 1.1 Setup Routing
```bash
npm install react-router-dom
```

- Configure React Router with lazy loading
- Create route guards/protected routes (if auth needed)
- Setup 404 handling

#### 1.2 Create Base Types & Schemas

**Priority Order:**
1. `guest.types.ts` / `guest.schema.ts`
2. `event.types.ts` / `event.schema.ts`
3. `vendor.types.ts` / `vendor.schema.ts`
4. `budget.types.ts` / `budget.schema.ts`
5. `task.types.ts` / `task.schema.ts`
6. `timeline.types.ts` / `timeline.schema.ts`

#### 1.3 Create Zustand Stores

**Priority Order:**
1. `guestListStore.ts` - Guest management
2. `eventStore.ts` - Event/wedding details
3. `vendorStore.ts` - Vendor management
4. `budgetStore.ts` - Budget tracking
5. `taskStore.ts` - Task management
6. `uiStore.ts` - UI state (modals, sidebars, etc.)

### Phase 2: Core Components (Week 2)

#### 2.1 Common Components
- Button (variants: primary, secondary, danger, ghost)
- Input (text, number, date, select, textarea)
- Modal (confirm, form, info)
- Card (basic, interactive, expandable)
- Table (sortable, filterable, paginated)
- Badge/Chip
- Toast/Notification

#### 2.2 Layout Components
- PageLayout (header + sidebar + content)
- Header (navigation, user menu)
- Sidebar (navigation menu)
- Footer

### Phase 3: Feature Implementation (Weeks 3-5)

#### 3.1 Dashboard Page
- Overview statistics
- Quick actions
- Upcoming tasks/deadlines
- Budget summary
- Recent activity

#### 3.2 Guest List Management
- Add/Edit/Delete guests
- Import/Export guest list (CSV)
- RSVP tracking
- Dietary requirements
- Table assignments
- Guest grouping (family, friends, colleagues)

#### 3.3 Master Dossier
- Wedding overview
- Key contacts
- Important documents
- Notes section
- Quick reference

#### 3.4 Vendor Management
- Add/Edit/Delete vendors
- Contract tracking
- Payment schedules
- Contact information
- Notes & communications log

#### 3.5 Budget Tracker
- Budget categories
- Expense tracking
- Payment status
- Visual charts (pie/bar)
- Budget vs Actual comparison

#### 3.6 Timeline
- Visual timeline view
- Event scheduling
- Duration estimates
- Vendor assignments per event
- Day-of schedule

#### 3.7 Task Manager
- Create/Edit/Delete tasks
- Due dates & reminders
- Priority levels
- Categories
- Completion tracking

### Phase 4: Polish & Testing (Week 6)

- Unit tests for all stores
- Component tests for key features
- Integration tests for user flows
- Accessibility audit
- Performance optimization
- Documentation

---

## Data Models & Schemas

### Guest Schema

```typescript
// src/schemas/guest.schema.ts
import { z } from 'zod';

export const GuestSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  side: z.enum(['bride', 'groom', 'both']),
  relationship: z.string().optional(),
  group: z.string().optional(), // family, friends, colleagues, etc.
  rsvpStatus: z.enum(['pending', 'attending', 'declined', 'maybe']),
  mealPreference: z.enum(['standard', 'vegetarian', 'vegan', 'other']).optional(),
  dietaryNotes: z.string().optional(),
  tableAssignment: z.string().optional(),
  plusOne: z.boolean().default(false),
  plusOneName: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GuestListSchema = z.array(GuestSchema);

export type Guest = z.infer<typeof GuestSchema>;
export type GuestList = z.infer<typeof GuestListSchema>;
export type RsvpStatus = Guest['rsvpStatus'];
export type GuestSide = Guest['side'];
export type MealPreference = Guest['mealPreference'];
```

### Event Schema

```typescript
// src/schemas/event.schema.ts
import { z } from 'zod';

export const EventSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['ceremony', 'reception', 'rehearsal', 'other']),
  date: z.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:mm format
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  location: z.object({
    name: z.string(),
    address: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
  vendorIds: z.array(z.string().uuid()).default([]),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const EventListSchema = z.array(EventSchema);

export type Event = z.infer<typeof EventSchema>;
export type EventList = z.infer<typeof EventListSchema>;
export type EventType = Event['type'];
```

### Vendor Schema

```typescript
// src/schemas/vendor.schema.ts
import { z } from 'zod';

export const VendorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  category: z.enum([
    'venue',
    'catering',
    'photography',
    'videography',
    'florist',
    'music',
    'cake',
    'transportation',
    'officiant',
    'beauty',
    'other',
  ]),
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  contractSigned: z.boolean().default(false),
  contractDate: z.date().optional(),
  totalCost: z.number().min(0).default(0),
  depositAmount: z.number().min(0).default(0),
  depositPaid: z.boolean().default(false),
  paymentSchedule: z.array(z.object({
    amount: z.number().min(0),
    dueDate: z.date(),
    paid: z.boolean().default(false),
    paidDate: z.date().optional(),
  })).default([]),
  notes: z.string().optional(),
  attachments: z.array(z.string()).default([]), // File paths/URLs
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const VendorListSchema = z.array(VendorSchema);

export type Vendor = z.infer<typeof VendorSchema>;
export type VendorList = z.infer<typeof VendorListSchema>;
export type VendorCategory = Vendor['category'];
```

### Budget Schema

```typescript
// src/schemas/budget.schema.ts
import { z } from 'zod';

export const BudgetItemSchema = z.object({
  id: z.string().uuid(),
  category: z.string().min(1),
  name: z.string().min(1).max(100),
  estimatedCost: z.number().min(0).default(0),
  actualCost: z.number().min(0).default(0),
  vendorId: z.string().uuid().optional(),
  isPaid: z.boolean().default(false),
  dueDate: z.date().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BudgetSchema = z.object({
  id: z.string().uuid(),
  totalBudget: z.number().min(0),
  items: z.array(BudgetItemSchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const BudgetListSchema = z.array(BudgetItemSchema);

export type BudgetItem = z.infer<typeof BudgetItemSchema>;
export type Budget = z.infer<typeof BudgetSchema>;
```

### Task Schema

```typescript
// src/schemas/task.schema.ts
import { z } from 'zod';

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.enum([
    'venue',
    'attire',
    'catering',
    'photography',
    'music',
    'flowers',
    'transportation',
    'guests',
    'other',
  ]),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['todo', 'in-progress', 'completed', 'cancelled']),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(), // Could be expanded to user reference
  tags: z.array(z.string()).default([]),
  subtasks: z.array(z.object({
    id: z.string().uuid(),
    title: z.string(),
    completed: z.boolean().default(false),
  })).default([]),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional(),
});

export const TaskListSchema = z.array(TaskSchema);

export type Task = z.infer<typeof TaskSchema>;
export type TaskList = z.infer<typeof TaskListSchema>;
export type TaskCategory = Task['category'];
export type TaskPriority = Task['priority'];
export type TaskStatus = Task['status'];
```

### Timeline Schema

```typescript
// src/schemas/timeline.schema.ts
import { z } from 'zod';

export const TimelineItemSchema = z.object({
  id: z.string().uuid(),
  eventId: z.string().uuid().optional(), // Link to Event
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/), // HH:mm format
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  duration: z.number().min(1).optional(), // Duration in minutes
  location: z.string().optional(),
  vendorIds: z.array(z.string().uuid()).default([]),
  keyContacts: z.array(z.object({
    name: z.string(),
    role: z.string(),
    phone: z.string().optional(),
  })).default([]),
  notes: z.string().optional(),
  order: z.number().int().min(0), // For sorting
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const TimelineSchema = z.object({
  id: z.string().uuid(),
  name: z.string().default('Wedding Day Timeline'),
  date: z.date(),
  items: z.array(TimelineItemSchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TimelineItem = z.infer<typeof TimelineItemSchema>;
export type Timeline = z.infer<typeof TimelineSchema>;
```

---

## State Management

### Store Architecture Pattern

Each store follows a consistent pattern:

```typescript
// Pattern: Store Structure
interface StoreState {
  // Data
  items: Type[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  addItem: (item: CreateType) => Promise<void>;
  updateItem: (id: string, updates: Partial<Type>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  
  // Computed/Selectors
  getItemById: (id: string) => Type | undefined;
  getFilteredItems: (filter: FilterType) => Type[];
}
```

### Guest List Store Example

```typescript
// src/stores/guestListStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Guest, RsvpStatus, GuestSide } from '../schemas/guest.schema';

interface GuestListState {
  guests: Guest[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addGuest: (guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  setGuests: (guests: Guest[]) => void;
  
  // Bulk operations
  importGuests: (guests: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  
  // Selectors
  getGuestById: (id: string) => Guest | undefined;
  getGuestsByRsvpStatus: (status: RsvpStatus) => Guest[];
  getGuestsBySide: (side: GuestSide) => Guest[];
  getTotalGuestCount: () => number;
  getAttendingCount: () => number;
}

export const useGuestListStore = create<GuestListState>()(
  devtools(
    persist(
      (set, get) => ({
        guests: [],
        isLoading: false,
        error: null,
        
        addGuest: (guestData) => {
          const now = new Date();
          const newGuest: Guest = {
            ...guestData,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
          };
          set((state) => ({
            guests: [...state.guests, newGuest],
          }));
        },
        
        updateGuest: (id, updates) => {
          set((state) => ({
            guests: state.guests.map((guest) =>
              guest.id === id
                ? { ...guest, ...updates, updatedAt: new Date() }
                : guest
            ),
          }));
        },
        
        deleteGuest: (id) => {
          set((state) => ({
            guests: state.guests.filter((guest) => guest.id !== id),
          }));
        },
        
        setGuests: (guests) => {
          set({ guests });
        },
        
        importGuests: (guestsData) => {
          const now = new Date();
          const newGuests: Guest[] = guestsData.map((data) => ({
            ...data,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
          }));
          set((state) => ({
            guests: [...state.guests, ...newGuests],
          }));
        },
        
        getGuestById: (id) => {
          return get().guests.find((guest) => guest.id === id);
        },
        
        getGuestsByRsvpStatus: (status) => {
          return get().guests.filter((guest) => guest.rsvpStatus === status);
        },
        
        getGuestsBySide: (side) => {
          return get().guests.filter((guest) => guest.side === side);
        },
        
        getTotalGuestCount: () => {
          const guests = get().guests;
          return guests.reduce((count, guest) => {
            return count + 1 + (guest.plusOne ? 1 : 0);
          }, 0);
        },
        
        getAttendingCount: () => {
          const guests = get().guests;
          return guests
            .filter((g) => g.rsvpStatus === 'attending')
            .reduce((count, guest) => {
              return count + 1 + (guest.plusOne ? 1 : 0);
            }, 0);
        },
      }),
      {
        name: 'elysian-guest-list',
      }
    )
  )
);
```

### UI Store Example

```typescript
// src/stores/uiStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Modals
  activeModal: string | null;
  modalData: unknown;
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: () => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // Notifications
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: Date;
  }>;
  addNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  devtools((set, get) => ({
    sidebarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    
    activeModal: null,
    modalData: null,
    openModal: (modalId, data) => set({ activeModal: modalId, modalData: data }),
    closeModal: () => set({ activeModal: null, modalData: null }),
    
    theme: 'light',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
    
    notifications: [],
    addNotification: (type, message) => {
      const notification = {
        id: crypto.randomUUID(),
        type,
        message,
        timestamp: new Date(),
      };
      set((state) => ({
        notifications: [...state.notifications, notification],
      }));
      
      // Auto-remove after 5 seconds
      setTimeout(() => {
        get().removeNotification(notification.id);
      }, 5000);
    },
    removeNotification: (id) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    },
  }))
);
```

---

## Component Structure

### Component Template

```typescript
// src/components/features/GuestList/GuestCard.tsx
import { type FC } from 'react';
import { type Guest } from '../../../schemas/guest.schema';
import { useGuestListStore } from '../../../stores/guestListStore';
import './GuestCard.css';

interface GuestCardProps {
  guest: Guest;
  onEdit?: (guest: Guest) => void;
}

export const GuestCard: FC<GuestCardProps> = ({ guest, onEdit }) => {
  const { deleteGuest } = useGuestListStore();
  
  const handleDelete = () => {
    if (window.confirm(`Remove ${guest.firstName} ${guest.lastName}?`)) {
      deleteGuest(guest.id);
    }
  };
  
  return (
    <div className="guest-card">
      <div className="guest-card__header">
        <h3>{guest.firstName} {guest.lastName}</h3>
        <span className={`rsvp-badge rsvp-badge--${guest.rsvpStatus}`}>
          {guest.rsvpStatus}
        </span>
      </div>
      {/* ... rest of component */}
    </div>
  );
};
```

### Custom Hook Pattern

```typescript
// src/hooks/useGuests.ts
import { useCallback, useMemo } from 'react';
import { useGuestListStore } from '../stores/guestListStore';
import type { RsvpStatus, GuestSide } from '../schemas/guest.schema';

export const useGuests = () => {
  const {
    guests,
    isLoading,
    error,
    addGuest,
    updateGuest,
    deleteGuest,
    getGuestsByRsvpStatus,
    getGuestsBySide,
    getTotalGuestCount,
    getAttendingCount,
  } = useGuestListStore();
  
  const pendingGuests = useMemo(() => getGuestsByRsvpStatus('pending'), [guests]);
  const attendingGuests = useMemo(() => getGuestsByRsvpStatus('attending'), [guests]);
  const declinedGuests = useMemo(() => getGuestsByRsvpStatus('declined'), [guests]);
  
  const brideSideGuests = useMemo(() => getGuestsBySide('bride'), [guests]);
  const groomSideGuests = useMemo(() => getGuestsBySide('groom'), [guests]);
  
  return {
    guests,
    isLoading,
    error,
    addGuest,
    updateGuest,
    deleteGuest,
    pendingGuests,
    attendingGuests,
    declinedGuests,
    brideSideGuests,
    groomSideGuests,
    totalGuestCount: getTotalGuestCount(),
    attendingCount: getAttendingCount(),
  };
};
```

---

## Testing Strategy

### Unit Tests (Stores)

```typescript
// src/test/stores/guestListStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useGuestListStore } from '../../stores/guestListStore';

describe('guestListStore', () => {
  beforeEach(() => {
    useGuestListStore.setState({ guests: [] });
  });
  
  it('should add a guest', () => {
    const { addGuest, guests } = useGuestListStore.getState();
    
    addGuest({
      firstName: 'John',
      lastName: 'Doe',
      side: 'bride',
      rsvpStatus: 'pending',
      plusOne: false,
    });
    
    expect(useGuestListStore.getState().guests).toHaveLength(1);
    expect(useGuestListStore.getState().guests[0].firstName).toBe('John');
  });
  
  it('should calculate total guest count including plus ones', () => {
    const { addGuest, getTotalGuestCount } = useGuestListStore.getState();
    
    addGuest({
      firstName: 'John',
      lastName: 'Doe',
      side: 'bride',
      rsvpStatus: 'attending',
      plusOne: true,
    });
    
    addGuest({
      firstName: 'Jane',
      lastName: 'Smith',
      side: 'groom',
      rsvpStatus: 'attending',
      plusOne: false,
    });
    
    expect(useGuestListStore.getState().getTotalGuestCount()).toBe(3);
  });
});
```

### Component Tests

```typescript
// src/test/components/GuestCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GuestCard } from '../../components/features/GuestList/GuestCard';
import type { Guest } from '../../schemas/guest.schema';

const mockGuest: Guest = {
  id: 'test-id',
  firstName: 'John',
  lastName: 'Doe',
  side: 'bride',
  rsvpStatus: 'attending',
  plusOne: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('GuestCard', () => {
  it('should render guest name', () => {
    render(<GuestCard guest={mockGuest} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
  
  it('should display RSVP status', () => {
    render(<GuestCard guest={mockGuest} />);
    expect(screen.getByText('attending')).toBeInTheDocument();
  });
});
```

---

## Getting Started Guide

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Preview production build
npm run preview
```

### Recommended Additional Packages

```bash
# Routing
npm install react-router-dom

# Date handling
npm install date-fns

# Icons
npm install lucide-react

# Charts (for budget visualization)
npm install recharts

# Form handling
npm install react-hook-form @hookform/resolvers

# Drag and drop (for timeline)
npm install @dnd-kit/core @dnd-kit/sortable

# PDF export (for reports)
npm install jspdf jspdf-autotable

# UUID generation (if not using crypto.randomUUID)
npm install uuid
npm install -D @types/uuid
```

### Development Workflow

1. **Create a feature branch**: `git checkout -b feature/guest-list`
2. **Implement schema**: Define Zod schema in `src/schemas/`
3. **Create types**: Export TypeScript types from schema
4. **Build store**: Create Zustand store with actions
5. **Create components**: Build UI components
6. **Write tests**: Add unit and component tests
7. **Submit PR**: Create pull request for review

---

## Appendix

### Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

### Code Style Guidelines

1. **Use TypeScript strict mode** - All code should be fully typed
2. **Prefer functional components** with hooks
3. **Use named exports** for components
4. **Keep components small** - Under 200 lines
5. **Extract logic to custom hooks** when reusable
6. **Use Zod for validation** - Both forms and API responses
7. **Follow React best practices** - Key props, memo when needed

### Git Commit Convention

```
feat: add guest list management
fix: resolve RSVP status update bug
docs: update API documentation
style: format code with prettier
refactor: extract guest card component
test: add unit tests for guestListStore
chore: update dependencies
```

---

## Next Steps

1. ✅ Review this document with the team
2. ⬜ Set up routing with React Router
3. ⬜ Implement Guest schema and store (highest priority)
4. ⬜ Build Guest List page as proof of concept
5. ⬜ Continue with remaining features in priority order

---

*Built for [oskee.picar](https://cop-pbe5638.slack.com/archives/C0AGEDUTPT7/p1771898832666669?thread_ts=1771872612.666839&cid=C0AGEDUTPT7) by [Kilo for Slack](https://kilo.ai/features/slack-integration)*
