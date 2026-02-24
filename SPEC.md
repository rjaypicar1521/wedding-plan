# Elysian Wedding Planner - Architecture Specification

## Overview

Elysian Wedding Planner is a modern, type-safe React application designed to help couples plan and organize their wedding events. This document outlines the technical architecture, domain models, and implementation roadmap.

---

## 1. Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React | 19.2.0 | UI component library |
| **Language** | TypeScript | 5.9.3 | Type-safe JavaScript |
| **Build Tool** | Vite | 7.3.1 | Fast development server & bundler |
| **State Management** | Zustand | 5.0.11 | Lightweight state management |
| **Schema Validation** | Zod | 4.3.6 | Runtime type validation & parsing |
| **Testing** | Vitest | 4.0.18 | Unit & integration testing |
| **Testing Library** | @testing-library/react | 16.3.2 | React component testing utilities |
| **Linting** | ESLint | 9.39.1 | Code quality enforcement |

### Key Technology Decisions

- **React 19**: Leverages the latest concurrent features, improved hydration, and the new `use()` hook for data fetching
- **TypeScript 5.9**: Full type safety with strict mode enabled for catch-all error prevention
- **Zustand**: Chosen over Redux for its minimal boilerplate, TypeScript-first design, and built-in devtools
- **Zod**: Provides runtime validation that complements TypeScript's compile-time checks, ensuring data integrity from APIs and user input

---

## 2. Current Project Status

### Status: Freshly Scaffolded

The project has been initialized with:
- ✅ Vite + React + TypeScript configuration
- ✅ ESLint configuration with React rules
- ✅ Vitest testing setup with jsdom environment
- ✅ Project folder structure scaffolded
- ✅ Core dependencies installed (React 19, Zustand, Zod)

### Not Yet Implemented
- ❌ Domain models and Zod schemas
- ❌ Zustand stores
- ❌ UI components
- ❌ Page routes
- ❌ API integration layer
- ❌ Authentication/authorization

---

## 3. Recommended Zod Schemas

### 3.1 Guest Schema

```typescript
// src/schemas/guest.schema.ts
import { z } from 'zod';

export const GuestStatusSchema = z.enum([
  'pending',
  'confirmed',
  'declined',
  'maybe'
]);

export const DietaryRestrictionSchema = z.enum([
  'none',
  'vegetarian',
  'vegan',
  'gluten-free',
  'kosher',
  'halal',
  'other'
]);

export const GuestSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  status: GuestStatusSchema.default('pending'),
  dietaryRestrictions: z.array(DietaryRestrictionSchema).default([]),
  dietaryNotes: z.string().optional(),
  plusOneAllowed: z.boolean().default(false),
  plusOneName: z.string().optional(),
  tableAssignment: z.string().optional(),
  notes: z.string().optional(),
  events: z.array(z.string().uuid()).default([]), // Event IDs
  createdAt: z.date(),
  updatedAt: z.date()
});

export const GuestCreateSchema = GuestSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const GuestUpdateSchema = GuestCreateSchema.partial();

export type Guest = z.infer<typeof GuestSchema>;
export type GuestCreate = z.infer<typeof GuestCreateSchema>;
export type GuestUpdate = z.infer<typeof GuestUpdateSchema>;
export type GuestStatus = z.infer<typeof GuestStatusSchema>;
export type DietaryRestriction = z.infer<typeof DietaryRestrictionSchema>;
```

### 3.2 Event Schema

```typescript
// src/schemas/event.schema.ts
import { z } from 'zod';

export const EventStatusSchema = z.enum([
  'planned',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled'
]);

export const EventSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['ceremony', 'reception', 'rehearsal-dinner', 'after-party', 'other']),
  date: z.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)).optional(),
  venue: z.object({
    name: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string().default('USA'),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional()
  }).optional(),
  status: EventStatusSchema.default('planned'),
  guestCount: z.number().int().min(0).default(0),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const EventCreateSchema = EventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const EventUpdateSchema = EventCreateSchema.partial();

export type Event = z.infer<typeof EventSchema>;
export type EventCreate = z.infer<typeof EventCreateSchema>;
export type EventUpdate = z.infer<typeof EventUpdateSchema>;
export type EventStatus = z.infer<typeof EventStatusSchema>;
```

### 3.3 Vendor Schema

```typescript
// src/schemas/vendor.schema.ts
import { z } from 'zod';

export const VendorCategorySchema = z.enum([
  'venue',
  'catering',
  'photography',
  'videography',
  'florist',
  'music',
  'dj',
  'officiant',
  'cake',
  'transportation',
  'hair-makeup',
  'rentals',
  'other'
]);

export const VendorStatusSchema = z.enum([
  'considering',
  'contacted',
  'quoted',
  'booked',
  'paid',
  'cancelled'
]);

export const VendorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  category: VendorCategorySchema,
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  status: VendorStatusSchema.default('considering'),
  contractSigned: z.boolean().default(false),
  contractUrl: z.string().url().optional(),
  pricing: z.object({
    quote: z.number().min(0),
    deposit: z.number().min(0).optional(),
    depositPaid: z.boolean().default(false),
    depositDate: z.date().optional(),
    totalPaid: z.number().min(0).default(0),
    paymentDueDate: z.date().optional()
  }).optional(),
  rating: z.number().min(1).max(5).optional(),
  events: z.array(z.string().uuid()).default([]), // Event IDs
  createdAt: z.date(),
  updatedAt: z.date()
});

export const VendorCreateSchema = VendorSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const VendorUpdateSchema = VendorCreateSchema.partial();

export type Vendor = z.infer<typeof VendorSchema>;
export type VendorCreate = z.infer<typeof VendorCreateSchema>;
export type VendorUpdate = z.infer<typeof VendorUpdateSchema>;
export type VendorCategory = z.infer<typeof VendorCategorySchema>;
export type VendorStatus = z.infer<typeof VendorStatusSchema>;
```

### 3.4 Budget Schema

```typescript
// src/schemas/budget.schema.ts
import { z } from 'zod';

export const BudgetCategorySchema = z.enum([
  'venue',
  'catering',
  'photography',
  'videography',
  'florist',
  'music',
  'dj',
  'officiant',
  'cake',
  'transportation',
  'hair-makeup',
  'rentals',
  'attire',
  'invitations',
  'decorations',
  'gifts',
  'miscellaneous',
  'other'
]);

export const BudgetItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  category: BudgetCategorySchema,
  estimatedCost: z.number().min(0),
  actualCost: z.number().min(0).optional(),
  vendorId: z.string().uuid().optional(),
  notes: z.string().optional(),
  isPaid: z.boolean().default(false),
  paidDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const BudgetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  totalBudget: z.number().min(0),
  items: z.array(BudgetItemSchema).default([]),
  currency: z.string().length(3).default('USD'),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const BudgetItemCreateSchema = BudgetItemSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const BudgetCreateSchema = BudgetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export type Budget = z.infer<typeof BudgetSchema>;
export type BudgetItem = z.infer<typeof BudgetItemSchema>;
export type BudgetCreate = z.infer<typeof BudgetCreateSchema>;
export type BudgetItemCreate = z.infer<typeof BudgetItemCreateSchema>;
export type BudgetCategory = z.infer<typeof BudgetCategorySchema>;
```

### 3.5 Task Schema

```typescript
// src/schemas/task.schema.ts
import { z } from 'zod';

export const TaskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);
export const TaskStatusSchema = z.enum(['todo', 'in-progress', 'completed', 'cancelled']);

export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  status: TaskStatusSchema.default('todo'),
  priority: TaskPrioritySchema.default('medium'),
  dueDate: z.date().optional(),
  completedDate: z.date().optional(),
  assignedTo: z.string().optional(), // User ID or name
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  subtasks: z.array(z.object({
    id: z.string().uuid(),
    title: z.string(),
    completed: z.boolean().default(false)
  })).default([]),
  relatedEventId: z.string().uuid().optional(),
  relatedVendorId: z.string().uuid().optional(),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const TaskCreateSchema = TaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const TaskUpdateSchema = TaskCreateSchema.partial();

export type Task = z.infer<typeof TaskSchema>;
export type TaskCreate = z.infer<typeof TaskCreateSchema>;
export type TaskUpdate = z.infer<typeof TaskUpdateSchema>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
```

---

## 4. Recommended Zustand Store Structure

### 4.1 Store Architecture

```
src/stores/
├── index.ts              # Store exports
├── guestStore.ts         # Guest state management
├── eventStore.ts         # Event state management
├── vendorStore.ts        # Vendor state management
├── budgetStore.ts        # Budget state management
├── taskStore.ts          # Task state management
├── uiStore.ts            # UI state (modals, toasts, theme)
└── middleware/
    ├── persist.ts        # Persistence middleware
    └── logger.ts         # Logging middleware
```

### 4.2 Guest Store Example

```typescript
// src/stores/guestStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Guest, GuestCreate, GuestUpdate, GuestStatus } from '../schemas/guest.schema';

interface GuestState {
  guests: Guest[];
  selectedGuestId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addGuest: (guest: GuestCreate) => void;
  updateGuest: (id: string, updates: GuestUpdate) => void;
  deleteGuest: (id: string) => void;
  selectGuest: (id: string | null) => void;
  setGuestStatus: (id: string, status: GuestStatus) => void;
  
  // Computed selectors
  getGuestById: (id: string) => Guest | undefined;
  getGuestsByStatus: (status: GuestStatus) => Guest[];
  getConfirmedGuestCount: () => number;
  getTotalGuestCount: () => number;
  
  // Async actions
  fetchGuests: () => Promise<void>;
  saveGuest: (guest: GuestCreate) => Promise<Guest>;
}

export const useGuestStore = create<GuestState>()(
  devtools(
    persist(
      (set, get) => ({
        guests: [],
        selectedGuestId: null,
        isLoading: false,
        error: null,

        addGuest: (guestData) => {
          const newGuest: Guest = {
            ...guestData,
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date()
          };
          set((state) => ({
            guests: [...state.guests, newGuest]
          }));
        },

        updateGuest: (id, updates) => {
          set((state) => ({
            guests: state.guests.map((guest) =>
              guest.id === id
                ? { ...guest, ...updates, updatedAt: new Date() }
                : guest
            )
          }));
        },

        deleteGuest: (id) => {
          set((state) => ({
            guests: state.guests.filter((guest) => guest.id !== id),
            selectedGuestId: state.selectedGuestId === id ? null : state.selectedGuestId
          }));
        },

        selectGuest: (id) => set({ selectedGuestId: id }),

        setGuestStatus: (id, status) => {
          get().updateGuest(id, { status });
        },

        getGuestById: (id) => get().guests.find((g) => g.id === id),

        getGuestsByStatus: (status) => get().guests.filter((g) => g.status === status),

        getConfirmedGuestCount: () => {
          const guests = get().guests;
          return guests.filter((g) => g.status === 'confirmed').reduce(
            (count, g) => count + 1 + (g.plusOneAllowed && g.plusOneName ? 1 : 0),
            0
          );
        },

        getTotalGuestCount: () => {
          const guests = get().guests;
          return guests.reduce(
            (count, g) => count + 1 + (g.plusOneAllowed && g.plusOneName ? 1 : 0),
            0
          );
        },

        fetchGuests: async () => {
          set({ isLoading: true, error: null });
          try {
            // API call would go here
            // const guests = await api.getGuests();
            // set({ guests, isLoading: false });
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
          }
        },

        saveGuest: async (guestData) => {
          set({ isLoading: true, error: null });
          try {
            // API call would go here
            // const guest = await api.createGuest(guestData);
            get().addGuest(guestData);
            const newGuest = get().guests[get().guests.length - 1];
            set({ isLoading: false });
            return newGuest;
          } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            throw error;
          }
        }
      }),
      {
        name: 'elysian-guests',
        partialize: (state) => ({ guests: state.guests })
      }
    ),
    { name: 'GuestStore' }
  )
);
```

### 4.3 UI Store Example

```typescript
// src/stores/uiStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Modals
  activeModal: string | null;
  modalData: unknown;
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: () => void;
  
  // Toasts
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
  
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Loading states
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'system',
        setTheme: (theme) => set({ theme }),
        
        activeModal: null,
        modalData: null,
        openModal: (modalId, data) => set({ activeModal: modalId, modalData: data }),
        closeModal: () => set({ activeModal: null, modalData: null }),
        
        toasts: [],
        addToast: (message, type, duration = 5000) => {
          const id = crypto.randomUUID();
          const toast: Toast = { id, message, type, duration };
          set((state) => ({ toasts: [...state.toasts, toast] }));
          
          if (duration > 0) {
            setTimeout(() => get().removeToast(id), duration);
          }
        },
        removeToast: (id) => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id)
          }));
        },
        
        sidebarOpen: true,
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        
        globalLoading: false,
        setGlobalLoading: (loading) => set({ globalLoading: loading })
      }),
      {
        name: 'elysian-ui',
        partialize: (state) => ({ theme: state.theme, sidebarOpen: state.sidebarOpen })
      }
    ),
    { name: 'UIStore' }
  )
);
```

---

## 5. Feature Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

| Priority | Feature | Description |
|----------|---------|-------------|
| 🔴 High | Project Setup | Configure TypeScript strict mode, ESLint rules, VSCode settings |
| 🔴 High | Schema Implementation | Create all Zod schemas with full validation |
| 🔴 High | Store Setup | Implement all Zustand stores with persistence |
| 🔴 High | Base Components | Button, Input, Select, Modal, Card, Table components |
| 🟡 Medium | Theme System | Light/dark mode with CSS variables |
| 🟡 Medium | Toast Notifications | Global notification system |

### Phase 2: Guest Management (Week 3-4)

| Priority | Feature | Description |
|----------|---------|-------------|
| 🔴 High | Guest List View | Table with sorting, filtering, pagination |
| 🔴 High | Guest CRUD | Create, read, update, delete guests |
| 🔴 High | Guest Import | CSV import for bulk guest addition |
| 🟡 Medium | Guest RSVP Form | Public RSVP link for guests |
| 🟡 Medium | Guest Seating | Table assignment functionality |
| 🟢 Low | Guest Communication | Email templates and sending |

### Phase 3: Event Management (Week 5-6)

| Priority | Feature | Description |
|----------|---------|-------------|
| 🔴 High | Event Timeline | Visual timeline of all wedding events |
| 🔴 High | Event CRUD | Create and manage multiple events |
| 🟡 Medium | Venue Management | Venue details with map integration |
| 🟡 Medium | Event Calendar | Calendar view of events |
| 🟢 Low | Event Templates | Pre-built event templates |

### Phase 4: Vendor Management (Week 7-8)

| Priority | Feature | Description |
|----------|---------|-------------|
| 🔴 High | Vendor Directory | List view with category filtering |
| 🔴 High | Vendor CRUD | Manage vendor information |
| 🟡 Medium | Contract Tracking | Contract status and document storage |
| 🟡 Medium | Vendor Comparison | Compare vendors side-by-side |
| 🟢 Low | Vendor Reviews | Rating and review system |

### Phase 5: Budget Management (Week 9-10)

| Priority | Feature | Description |
|----------|---------|-------------|
| 🔴 High | Budget Overview | Dashboard with spending visualization |
| 🔴 High | Budget Items | Track estimated vs actual costs |
| 🟡 Medium | Payment Tracking | Payment schedules and reminders |
| 🟡 Medium | Budget Reports | Export and reporting features |
| 🟢 Low | Budget Alerts | Overspending notifications |

### Phase 6: Task Management (Week 11-12)

| Priority | Feature | Description |
|----------|---------|-------------|
| 🔴 High | Task Board | Kanban-style task management |
| 🔴 High | Task CRUD | Create and manage tasks |
| 🟡 Medium | Due Date Reminders | Notification system for deadlines |
| 🟡 Medium | Task Templates | Wedding planning checklist templates |
| 🟢 Low | Task Assignment | Assign tasks to team members |

### Phase 7: Polish & Launch (Week 13-14)

| Priority | Feature | Description |
|----------|---------|-------------|
| 🔴 High | Dashboard | Overview of all wedding planning metrics |
| 🔴 High | Data Export | Export all data to PDF/CSV |
| 🟡 Medium | Mobile Responsive | Ensure full mobile support |
| 🟡 Medium | Performance | Optimize bundle size and loading |
| 🟢 Low | Onboarding | User onboarding flow |

---

## 6. Proposed Folder Structure

```
elysian-wedding-planner/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Continuous integration
│       └── deploy.yml                # Deployment workflow
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── common/                   # Reusable UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   ├── Button.styles.ts
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Select/
│   │   │   ├── Modal/
│   │   │   ├── Card/
│   │   │   ├── Table/
│   │   │   ├── Toast/
│   │   │   └── index.ts
│   │   ├── layout/                   # Layout components
│   │   │   ├── Header/
│   │   │   ├── Sidebar/
│   │   │   ├── Footer/
│   │   │   ├── MainLayout/
│   │   │   └── index.ts
│   │   ├── features/                 # Feature-specific components
│   │   │   ├── guests/
│   │   │   │   ├── GuestList/
│   │   │   │   ├── GuestForm/
│   │   │   │   ├── GuestCard/
│   │   │   │   └── GuestImport/
│   │   │   ├── events/
│   │   │   ├── vendors/
│   │   │   ├── budget/
│   │   │   ├── tasks/
│   │   │   └── dashboard/
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useGuests.ts
│   │   ├── useEvents.ts
│   │   ├── useVendors.ts
│   │   ├── useBudget.ts
│   │   ├── useTasks.ts
│   │   ├── useToast.ts
│   │   ├── useTheme.ts
│   │   ├── useLocalStorage.ts
│   │   └── index.ts
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── index.ts
│   │   ├── Guests/
│   │   ├── Events/
│   │   ├── Vendors/
│   │   ├── Budget/
│   │   ├── Tasks/
│   │   ├── Settings/
│   │   └── NotFound/
│   ├── schemas/
│   │   ├── guest.schema.ts
│   │   ├── event.schema.ts
│   │   ├── vendor.schema.ts
│   │   ├── budget.schema.ts
│   │   ├── task.schema.ts
│   │   ├── common.schema.ts        # Shared schema utilities
│   │   └── index.ts
│   ├── stores/
│   │   ├── guestStore.ts
│   │   ├── eventStore.ts
│   │   ├── vendorStore.ts
│   │   ├── budgetStore.ts
│   │   ├── taskStore.ts
│   │   ├── uiStore.ts
│   │   ├── middleware/
│   │   │   ├── persist.ts
│   │   │   └── logger.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── api.types.ts            # API response types
│   │   ├── store.types.ts          # Store state types
│   │   ├── component.types.ts      # Component prop types
│   │   └── index.ts
│   ├── utils/
│   │   ├── api.ts                  # API client
│   │   ├── formatters.ts           # Date, currency formatters
│   │   ├── validators.ts           # Custom validation functions
│   │   ├── constants.ts            # App constants
│   │   ├── helpers.ts              # Utility functions
│   │   └── index.ts
│   ├── services/
│   │   ├── guestService.ts
│   │   ├── eventService.ts
│   │   ├── vendorService.ts
│   │   ├── budgetService.ts
│   │   ├── taskService.ts
│   │   └── index.ts
│   ├── styles/
│   │   ├── variables.css           # CSS custom properties
│   │   ├── globals.css             # Global styles
│   │   ├── animations.css          # Keyframe animations
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   ├── test/
│   │   ├── setup.ts
│   │   ├── mocks/
│   │   │   ├── guests.ts
│   │   │   ├── events.ts
│   │   │   └── index.ts
│   │   └── utils/
│   │       ├── render.tsx          # Custom render with providers
│   │       └── factories.ts        # Test data factories
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── SPEC.md
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 7. Development Guidelines

### Code Style

- Use functional components with hooks
- Prefer named exports over default exports
- Use TypeScript strict mode
- All components should have TypeScript prop interfaces
- Use Zod for runtime validation of external data
- Keep components small and focused (single responsibility)

### Testing Strategy

- Unit tests for all utility functions and hooks
- Component tests for all UI components
- Integration tests for store actions
- E2E tests for critical user flows (future)

### Git Workflow

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `fix/*` - Bug fix branches

### Commit Convention

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
```

---

## 8. Future Considerations

- **Authentication**: Add user authentication with OAuth providers
- **Multi-wedding Support**: Allow users to manage multiple weddings
- **Collaboration**: Real-time collaboration with partner and planners
- **Mobile App**: React Native mobile application
- **API Backend**: Node.js/Express or serverless backend
- **AI Features**: AI-powered suggestions and timeline generation

---

*Last Updated: February 2026*
