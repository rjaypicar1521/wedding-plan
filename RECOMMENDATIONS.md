# Wedding Planner App - Architecture Recommendations

This document outlines the recommended architecture for the Elysian Wedding Planner application, including state management, schema validation, type definitions, and folder structure.

## Table of Contents

1. [Feature Folder Structure](#feature-folder-structure)
2. [Type Definitions](#type-definitions)
3. [Zod Schema Definitions](#zod-schema-definitions)
4. [Zustand Store Setup](#zustand-store-setup)

---

## Feature Folder Structure

We recommend organizing code by feature rather than by file type. This improves discoverability and maintainability as the application grows.

### Recommended Structure

```
src/
├── components/           # Shared/reusable components
│   ├── ui/              # Generic UI components (Button, Input, Modal, etc.)
│   └── layout/          # Layout components (Header, Sidebar, Footer, etc.)
├── features/
│   ├── guests/          # Guest management feature
│   │   ├── components/  # Feature-specific components
│   │   │   ├── GuestList.tsx
│   │   │   ├── GuestCard.tsx
│   │   │   └── GuestForm.tsx
│   │   ├── hooks/       # Feature-specific hooks
│   │   │   └── useGuestActions.ts
│   │   ├── schemas/     # Feature-specific schemas
│   │   │   └── guest.schema.ts
│   │   ├── stores/      # Feature-specific stores
│   │   │   └── guest.store.ts
│   │   ├── types/       # Feature-specific types
│   │   │   └── guest.types.ts
│   │   └── index.ts     # Feature barrel export
│   ├── budget/          # Budget management feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── stores/
│   │   ├── types/
│   │   └── index.ts
│   ├── timeline/        # Wedding timeline/schedule feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── stores/
│   │   ├── types/
│   │   └── index.ts
│   ├── vendors/         # Vendor management feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── stores/
│   │   ├── types/
│   │   └── index.ts
│   └── rsvp/            # RSVP management feature
│       ├── components/
│       ├── hooks/
│       ├── schemas/
│       ├── stores/
│       ├── types/
│       └── index.ts
├── hooks/               # Shared/global hooks
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── schemas/             # Shared/global schemas
│   └── common.schema.ts
├── stores/              # Shared/global stores
│   └── app.store.ts
├── types/               # Shared/global types
│   └── common.types.ts
├── utils/               # Utility functions
│   ├── formatters.ts
│   └── validators.ts
├── pages/               # Page/route components
│   ├── Dashboard.tsx
│   ├── Guests.tsx
│   ├── Budget.tsx
│   └── Settings.tsx
├── test/               # Test setup and utilities
│   ├── setup.ts
│   └── test-utils.tsx
├── App.tsx
└── main.tsx
```

### Key Principles

1. **Feature Isolation**: Each feature is self-contained with its own components, hooks, schemas, stores, and types
2. **Barrel Exports**: Use `index.ts` files to expose public API of each feature
3. **Shared Resources**: Common utilities, components, and types go in top-level directories
4. **Colocation**: Keep related files together for better maintainability

---

## Type Definitions

### Core Types (`src/types/common.types.ts`)

```typescript
// Common utility types
export type UUID = string & { readonly __brand: unique symbol };

export type Status = 'pending' | 'confirmed' | 'cancelled';

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface EntityWithId {
  id: UUID;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

### Guest Types (`src/features/guests/types/guest.types.ts`)

```typescript
import type { UUID, Status, Timestamps, EntityWithId } from '@/types/common.types';

export type GuestStatus = 'invited' | 'confirmed' | 'declined' | 'maybe';
export type MealPreference = 'chicken' | 'fish' | 'vegetarian' | 'vegan' | 'none';
export type GuestSide = 'bride' | 'groom' | 'both';

export interface Guest extends EntityWithId, Timestamps {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: GuestStatus;
  mealPreference: MealPreference;
  side: GuestSide;
  tableId?: UUID;
  plusOneAllowed: boolean;
  plusOneName?: string;
  plusOneMealPreference?: MealPreference;
  dietaryRestrictions?: string[];
  notes?: string;
}

export interface GuestGroup extends EntityWithId {
  name: string;
  guests: Guest[];
  primaryContactId: UUID;
}

export interface GuestFilters {
  status?: GuestStatus;
  side?: GuestSide;
  hasPlusOne?: boolean;
  search?: string;
}

export interface GuestStats {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  bySide: {
    bride: number;
    groom: number;
    both: number;
  };
}
```

### Budget Types (`src/features/budget/types/budget.types.ts`)

```typescript
import type { UUID, Timestamps, EntityWithId } from '@/types/common.types';

export type ExpenseCategory = 
  | 'venue'
  | 'catering'
  | 'photography'
  | 'videography'
  | 'flowers'
  | 'music'
  | 'attire'
  | 'transportation'
  | 'decorations'
  | 'other';

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded';

export interface BudgetItem extends EntityWithId, Timestamps {
  name: string;
  description?: string;
  category: ExpenseCategory;
  estimatedCost: number;
  actualCost: number;
  depositAmount: number;
  depositPaid: boolean;
  paymentStatus: PaymentStatus;
  dueDate?: Date;
  vendorId?: UUID;
  notes?: string;
}

export interface BudgetSummary {
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  totalRemaining: number;
  byCategory: Record<ExpenseCategory, {
    estimated: number;
    actual: number;
    count: number;
  }>;
}
```

### Timeline Types (`src/features/timeline/types/timeline.types.ts`)

```typescript
import type { UUID, Timestamps, EntityWithId } from '@/types/common.types';

export type EventType = 'ceremony' | 'reception' | 'photo' | 'meal' | 'dance' | 'other';

export interface TimelineEvent extends EntityWithId, Timestamps {
  title: string;
  description?: string;
  eventType: EventType;
  startTime: Date;
  endTime: Date;
  location?: string;
  vendorIds?: UUID[];
  guestNotes?: string;
  isPublic: boolean;
  order: number;
}

export interface TimelineDay {
  date: Date;
  events: TimelineEvent[];
}
```

---

## Zod Schema Definitions

### Common Schemas (`src/schemas/common.schema.ts`)

```typescript
import { z } from 'zod';

export const uuidSchema = z.string().uuid();

export const timestampsSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(20),
});

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    hasMore: z.boolean(),
  });
```

### Guest Schemas (`src/features/guests/schemas/guest.schema.ts`)

```typescript
import { z } from 'zod';
import { uuidSchema, timestampsSchema } from '@/schemas/common.schema';

// Enums
export const guestStatusSchema = z.enum(['invited', 'confirmed', 'declined', 'maybe']);
export const mealPreferenceSchema = z.enum(['chicken', 'fish', 'vegetarian', 'vegan', 'none']);
export const guestSideSchema = z.enum(['bride', 'groom', 'both']);

// Guest Schema
export const guestSchema = z.object({
  id: uuidSchema,
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z.string().optional(),
  status: guestStatusSchema,
  mealPreference: mealPreferenceSchema,
  side: guestSideSchema,
  tableId: uuidSchema.optional(),
  plusOneAllowed: z.boolean().default(false),
  plusOneName: z.string().max(100).optional(),
  plusOneMealPreference: mealPreferenceSchema.optional(),
  dietaryRestrictions: z.array(z.string()).optional(),
  notes: z.string().max(500).optional(),
}).merge(timestampsSchema);

// Create Guest Schema (for form validation)
export const createGuestSchema = guestSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update Guest Schema
export const updateGuestSchema = createGuestSchema.partial();

// Guest Filters Schema
export const guestFiltersSchema = z.object({
  status: guestStatusSchema.optional(),
  side: guestSideSchema.optional(),
  hasPlusOne: z.boolean().optional(),
  search: z.string().max(100).optional(),
});

// Type exports (inferred from schemas)
export type Guest = z.infer<typeof guestSchema>;
export type CreateGuestInput = z.infer<typeof createGuestSchema>;
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;
export type GuestFilters = z.infer<typeof guestFiltersSchema>;
```

### Budget Schemas (`src/features/budget/schemas/budget.schema.ts`)

```typescript
import { z } from 'zod';
import { uuidSchema, timestampsSchema } from '@/schemas/common.schema';

// Enums
export const expenseCategorySchema = z.enum([
  'venue',
  'catering',
  'photography',
  'videography',
  'flowers',
  'music',
  'attire',
  'transportation',
  'decorations',
  'other',
]);

export const paymentStatusSchema = z.enum(['pending', 'partial', 'paid', 'refunded']);

// Budget Item Schema
export const budgetItemSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: expenseCategorySchema,
  estimatedCost: z.number().nonnegative(),
  actualCost: z.number().nonnegative().default(0),
  depositAmount: z.number().nonnegative().default(0),
  depositPaid: z.boolean().default(false),
  paymentStatus: paymentStatusSchema.default('pending'),
  dueDate: z.coerce.date().optional(),
  vendorId: uuidSchema.optional(),
  notes: z.string().max(500).optional(),
}).merge(timestampsSchema);

// Create Budget Item Schema
export const createBudgetItemSchema = budgetItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update Budget Item Schema
export const updateBudgetItemSchema = createBudgetItemSchema.partial();

// Type exports
export type BudgetItem = z.infer<typeof budgetItemSchema>;
export type CreateBudgetItemInput = z.infer<typeof createBudgetItemSchema>;
export type UpdateBudgetItemInput = z.infer<typeof updateBudgetItemSchema>;
```

### Timeline Schemas (`src/features/timeline/schemas/timeline.schema.ts`)

```typescript
import { z } from 'zod';
import { uuidSchema, timestampsSchema } from '@/schemas/common.schema';

// Enums
export const eventTypeSchema = z.enum(['ceremony', 'reception', 'photo', 'meal', 'dance', 'other']);

// Timeline Event Schema
export const timelineEventSchema = z.object({
  id: uuidSchema,
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  eventType: eventTypeSchema,
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  location: z.string().max(200).optional(),
  vendorIds: z.array(uuidSchema).optional(),
  guestNotes: z.string().max(500).optional(),
  isPublic: z.boolean().default(true),
  order: z.number().int().nonnegative(),
}).merge(timestampsSchema)
  .refine(
    (data) => data.endTime > data.startTime,
    { message: 'End time must be after start time' }
  );

// Create Timeline Event Schema
export const createTimelineEventSchema = timelineEventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Update Timeline Event Schema
export const updateTimelineEventSchema = createTimelineEventSchema.partial();

// Type exports
export type TimelineEvent = z.infer<typeof timelineEventSchema>;
export type CreateTimelineEventInput = z.infer<typeof createTimelineEventSchema>;
export type UpdateTimelineEventInput = z.infer<typeof updateTimelineEventSchema>;
```

---

## Zustand Store Setup

### Store Patterns

We recommend using a slice-based pattern for organizing Zustand stores. Each feature has its own store, and they can be composed together for the global store.

### App Store (`src/stores/app.store.ts`)

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Theme
        theme: 'light',
        setTheme: (theme) => set({ theme }),
        
        // Sidebar
        sidebarOpen: true,
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        
        // Notifications
        notifications: [],
        addNotification: (notification) =>
          set((state) => ({
            notifications: [
              ...state.notifications,
              { ...notification, id: crypto.randomUUID() },
            ],
          })),
        removeNotification: (id) =>
          set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
          })),
        clearNotifications: () => set({ notifications: [] }),
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen }),
      }
    ),
    { name: 'AppStore' }
  )
);
```

### Guest Store (`src/features/guests/stores/guest.store.ts`)

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Guest, GuestFilters, GuestStats } from '../types/guest.types';

interface GuestState {
  // Data
  guests: Guest[];
  selectedGuestId: string | null;
  
  // Filters
  filters: GuestFilters;
  setFilters: (filters: Partial<GuestFilters>) => void;
  resetFilters: () => void;
  
  // Computed
  getStats: () => GuestStats;
  getFilteredGuests: () => Guest[];
  
  // Actions
  setGuests: (guests: Guest[]) => void;
  addGuest: (guest: Guest) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  removeGuest: (id: string) => void;
  
  // Selection
  selectGuest: (id: string | null) => void;
  
  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  
  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
}

const defaultFilters: GuestFilters = {
  status: undefined,
  side: undefined,
  hasPlusOne: undefined,
  search: undefined,
};

export const useGuestStore = create<GuestState>()(
  devtools(
    persist(
      (set, get) => ({
        // Data
        guests: [],
        selectedGuestId: null,
        
        // Filters
        filters: defaultFilters,
        setFilters: (filters) =>
          set((state) => ({ filters: { ...state.filters, ...filters } })),
        resetFilters: () => set({ filters: defaultFilters }),
        
        // Computed
        getStats: () => {
          const guests = get().guests;
          return {
            total: guests.length,
            confirmed: guests.filter((g) => g.status === 'confirmed').length,
            declined: guests.filter((g) => g.status === 'declined').length,
            pending: guests.filter((g) => g.status === 'invited').length,
            bySide: {
              bride: guests.filter((g) => g.side === 'bride').length,
              groom: guests.filter((g) => g.side === 'groom').length,
              both: guests.filter((g) => g.side === 'both').length,
            },
          };
        },
        
        getFilteredGuests: () => {
          const { guests, filters } = get();
          return guests.filter((guest) => {
            if (filters.status && guest.status !== filters.status) return false;
            if (filters.side && guest.side !== filters.side) return false;
            if (filters.hasPlusOne !== undefined && guest.plusOneAllowed !== filters.hasPlusOne) return false;
            if (filters.search) {
              const search = filters.search.toLowerCase();
              const matchesSearch =
                guest.firstName.toLowerCase().includes(search) ||
                guest.lastName.toLowerCase().includes(search) ||
                guest.email.toLowerCase().includes(search);
              if (!matchesSearch) return false;
            }
            return true;
          });
        },
        
        // Actions
        setGuests: (guests) => set({ guests }),
        addGuest: (guest) =>
          set((state) => ({ guests: [...state.guests, guest] })),
        updateGuest: (id, updates) =>
          set((state) => ({
            guests: state.guests.map((g) =>
              g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g
            ),
          })),
        removeGuest: (id) =>
          set((state) => ({
            guests: state.guests.filter((g) => g.id !== id),
          })),
        
        // Selection
        selectGuest: (id) => set({ selectedGuestId: id }),
        
        // Loading states
        isLoading: false,
        setLoading: (loading) => set({ isLoading: loading }),
        
        // Error handling
        error: null,
        setError: (error) => set({ error }),
      }),
      {
        name: 'guest-storage',
        partialize: (state) => ({ guests: state.guests }),
      }
    ),
    { name: 'GuestStore' }
  )
);
```

### Budget Store (`src/features/budget/stores/budget.store.ts`)

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { BudgetItem, BudgetSummary, ExpenseCategory } from '../types/budget.types';

interface BudgetState {
  // Data
  items: BudgetItem[];
  selectedItemId: string | null;
  
  // Computed
  getSummary: () => BudgetSummary;
  getByCategory: (category: ExpenseCategory) => BudgetItem[];
  
  // Actions
  setItems: (items: BudgetItem[]) => void;
  addItem: (item: BudgetItem) => void;
  updateItem: (id: string, updates: Partial<BudgetItem>) => void;
  removeItem: (id: string) => void;
  
  // Selection
  selectItem: (id: string | null) => void;
  
  // Loading & Error
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useBudgetStore = create<BudgetState>()(
  devtools(
    persist(
      (set, get) => ({
        // Data
        items: [],
        selectedItemId: null,
        
        // Computed
        getSummary: () => {
          const items = get().items;
          const categories: ExpenseCategory[] = [
            'venue', 'catering', 'photography', 'videography',
            'flowers', 'music', 'attire', 'transportation', 'decorations', 'other'
          ];
          
          const byCategory = categories.reduce((acc, category) => {
            const categoryItems = items.filter((i) => i.category === category);
            acc[category] = {
              estimated: categoryItems.reduce((sum, i) => sum + i.estimatedCost, 0),
              actual: categoryItems.reduce((sum, i) => sum + i.actualCost, 0),
              count: categoryItems.length,
            };
            return acc;
          }, {} as Record<ExpenseCategory, { estimated: number; actual: number; count: number }>);
          
          return {
            totalEstimated: items.reduce((sum, i) => sum + i.estimatedCost, 0),
            totalActual: items.reduce((sum, i) => sum + i.actualCost, 0),
            totalPaid: items.filter((i) => i.paymentStatus === 'paid').reduce((sum, i) => sum + i.actualCost, 0),
            totalRemaining: items.reduce((sum, i) => sum + i.estimatedCost - i.actualCost, 0),
            byCategory,
          };
        },
        
        getByCategory: (category) => {
          return get().items.filter((item) => item.category === category);
        },
        
        // Actions
        setItems: (items) => set({ items }),
        addItem: (item) =>
          set((state) => ({ items: [...state.items, item] })),
        updateItem: (id, updates) =>
          set((state) => ({
            items: state.items.map((i) =>
              i.id === id ? { ...i, ...updates, updatedAt: new Date() } : i
            ),
          })),
        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter((i) => i.id !== id),
          })),
        
        // Selection
        selectItem: (id) => set({ selectedItemId: id }),
        
        // Loading & Error
        isLoading: false,
        setLoading: (loading) => set({ isLoading: loading }),
        error: null,
        setError: (error) => set({ error }),
      }),
      {
        name: 'budget-storage',
        partialize: (state) => ({ items: state.items }),
      }
    ),
    { name: 'BudgetStore' }
  )
);
```

### Timeline Store (`src/features/timeline/stores/timeline.store.ts`)

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { TimelineEvent } from '../types/timeline.types';

interface TimelineState {
  // Data
  events: TimelineEvent[];
  selectedEventId: string | null;
  
  // Actions
  setEvents: (events: TimelineEvent[]) => void;
  addEvent: (event: TimelineEvent) => void;
  updateEvent: (id: string, updates: Partial<TimelineEvent>) => void;
  removeEvent: (id: string) => void;
  reorderEvents: (startIndex: number, endIndex: number) => void;
  
  // Selection
  selectEvent: (id: string | null) => void;
  
  // Loading & Error
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useTimelineStore = create<TimelineState>()(
  devtools(
    persist(
      (set, get) => ({
        // Data
        events: [],
        selectedEventId: null,
        
        // Actions
        setEvents: (events) => set({ events }),
        addEvent: (event) =>
          set((state) => ({ events: [...state.events, event] })),
        updateEvent: (id, updates) =>
          set((state) => ({
            events: state.events.map((e) =>
              e.id === id ? { ...e, ...updates, updatedAt: new Date() } : e
            ),
          })),
        removeEvent: (id) =>
          set((state) => ({
            events: state.events.filter((e) => e.id !== id),
          })),
        reorderEvents: (startIndex, endIndex) =>
          set((state) => {
            const events = [...state.events];
            const [removed] = events.splice(startIndex, 1);
            events.splice(endIndex, 0, removed);
            return { events };
          }),
        
        // Selection
        selectEvent: (id) => set({ selectedEventId: id }),
        
        // Loading & Error
        isLoading: false,
        setLoading: (loading) => set({ isLoading: loading }),
        error: null,
        setError: (error) => set({ error }),
      }),
      {
        name: 'timeline-storage',
        partialize: (state) => ({ events: state.events }),
      }
    ),
    { name: 'TimelineStore' }
  )
);
```

---

## Usage Examples

### Using Stores in Components

```tsx
// src/features/guests/components/GuestList.tsx
import { useGuestStore } from '../stores/guest.store';
import { GuestCard } from './GuestCard';

export function GuestList() {
  const { getFilteredGuests, isLoading, error } = useGuestStore();
  const guests = getFilteredGuests();
  
  if (isLoading) return <div>Loading guests...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="guest-list">
      {guests.map((guest) => (
        <GuestCard key={guest.id} guest={guest} />
      ))}
    </div>
  );
}
```

### Using Schemas for Form Validation

```tsx
// src/features/guests/components/GuestForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGuestSchema, type CreateGuestInput } from '../schemas/guest.schema';
import { useGuestStore } from '../stores/guest.store';

export function GuestForm() {
  const { addGuest } = useGuestStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGuestInput>({
    resolver: zodResolver(createGuestSchema),
  });
  
  const onSubmit = (data: CreateGuestInput) => {
    addGuest({
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} placeholder="First Name" />
      {errors.firstName && <span>{errors.firstName.message}</span>}
      
      <input {...register('lastName')} placeholder="Last Name" />
      {errors.lastName && <span>{errors.lastName.message}</span>}
      
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}
      
      <button type="submit">Add Guest</button>
    </form>
  );
}
```

---

## Best Practices

1. **Keep stores focused**: Each store should manage a single domain of state
2. **Use TypeScript strictly**: Always type your stores and schemas
3. **Validate at boundaries**: Use Zod schemas for API responses and form inputs
4. **Persist selectively**: Only persist data that makes sense to survive page reloads
5. **Use devtools**: Enable Redux DevTools for debugging state changes
6. **Colocate by feature**: Keep feature-specific code together for maintainability
7. **Export from index**: Use barrel exports to simplify imports

---

## Dependencies

The following packages are required for this architecture:

- `zustand` - State management
- `zod` - Schema validation
- `react-hook-form` (optional) - Form handling
- `@hookform/resolvers` (optional) - Zod integration with react-hook-form

Install optional dependencies:
```bash
npm install react-hook-form @hookform/resolvers
```
