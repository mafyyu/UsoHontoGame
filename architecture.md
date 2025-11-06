# Frontend Architecture

This document outlines the design patterns and architectural decisions for the CPM Prototype frontend built with Next.js 15 and React 19.

## Architecture Overview

### Framework Stack
- **Next.js 15**: App Router with React Server Components
- **React 19**: Latest features including Server Components and Actions
- **TypeScript 5**: Full type safety across the application
- **Tailwind CSS v4**: Utility-first styling

## Directory Structure

```
src/
├── app/                    # App Router (Next.js 15)
│   ├── (auth)/            # Route groups for authentication
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── pages/            # Page-level components
│   │   ├── TopPage/      # Top/landing page components
│   │   ├── DashboardPage/ # Dashboard page components
│   │   └── SettingsPage/ # Settings page components
│   ├── ui/               # Base UI components (Button, Input, Modal)
│   ├── forms/            # Form-specific components
│   ├── layout/           # Layout components (Header, Sidebar, Footer)
│   └── domain/           # Domain-specific components
│       ├── budget/       # Budget domain components
│       ├── tenant/       # Tenant management components
│       ├── user/         # User domain components
│       └── auth/         # Authentication components
├── lib/                  # Utility functions and configurations
│   ├── utils.ts          # Common utilities
│   ├── api.ts            # API client configuration
│   └── auth.ts           # Authentication utilities
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── constants/            # Application constants
```

## Component Architecture

### Pages Layer Components
The pages layer contains page-level components that compose domain and UI components to create complete page experiences. These components handle page-specific concerns and coordinate between multiple domains.

#### Structure
```
components/pages/
├── TopPage/
│   ├── index.tsx          # Landing page component
│   ├── TopPage.types.ts   # Type definitions
│   ├── TopPage.stories.tsx # Storybook stories
│   └── hooks/
│       └── useTopPage.ts  # Page-specific logic
├── DashboardPage/
│   ├── index.tsx
│   ├── DashboardPage.types.ts
│   └── hooks/
│       └── useDashboardPage.ts
└── SettingsPage/
    ├── index.tsx
    ├── SettingsPage.types.ts
    └── hooks/
        └── useSettingsPage.ts
```

#### Pages Component Principles

1. **Page Composition**: Pages components compose domain and UI components to create complete page experiences
2. **Navigation Logic**: Handle page-specific navigation, routing, and URL state management
3. **Cross-Domain Coordination**: Coordinate interactions between multiple business domains
4. **Layout Management**: Manage page-specific layouts and responsive behavior
5. **SEO and Metadata**: Handle page-specific SEO, meta tags, and structured data

```tsx
// components/pages/TopPage/index.tsx
"use client";
import { useTopPage } from './hooks';
import type { TopPageProps } from './TopPage.types';

export function TopPage(props: TopPageProps) {
  const { handleLogin } = useTopPage();

  return (
    <div className="top-page">
      <h1>CPM Prototype</h1>
      <Button onClick={handleLogin} variant="primary">
        Login
      </Button>
    </div>
  );
}
```

#### Pages vs Domain vs UI Component Hierarchy

| Layer | Purpose | Examples |
|-------|---------|----------|
| **Pages** | Complete page experiences, navigation | `TopPage`, `DashboardPage` |
| **Domain** | Business logic, domain-specific behavior | `BudgetForm`, `UserProfile` |
| **UI** | Reusable components, design system | `Button`, `Input`, `Modal` |

### Domain Layer Components
The domain layer contains components that are specific to business domains, encapsulating domain logic and business rules within the UI layer.

#### Structure
```
components/domain/
├── budget/
│   ├── BudgetForm/
│   │   ├── index.tsx
│   │   ├── BudgetForm.types.ts
│   │   └── BudgetForm.test.tsx
│   ├── BudgetList/
│   ├── BudgetChart/
│   └── index.ts          # Export barrel
├── tenant/
│   ├── TenantSelector/
│   ├── TenantSettings/
│   └── TenantMemberList/
├── user/
│   ├── UserProfile/
│   ├── UserPermissions/
│   └── UserInvite/
└── auth/
    ├── LoginForm/
    ├── OAuthCallback/
    └── AuthGuard/
```

#### Domain Component Principles

1. **Business Logic Encapsulation**: Domain components contain business-specific validation, formatting, and behavior
2. **Self-Contained**: Each domain component manages its own state and side effects
3. **Reusable**: Can be used across different pages while maintaining domain consistency
4. **Testable**: Business logic is isolated and easily testable

```tsx
// components/domain/budget/BudgetForm/index.tsx
"use client";
import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { validateBudgetData, formatCurrency } from '@/lib/budget';
import type { BudgetFormData } from './BudgetForm.types';

export function BudgetForm({ onSubmit, initialData }: BudgetFormProps) {
  const [data, setData] = useState<BudgetFormData>(initialData);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Domain-specific validation
    const validationErrors = validateBudgetData(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="budget-form">
      <Input
        label="Budget Amount"
        value={formatCurrency(data.amount)}
        onChange={(value) => setData({ ...data, amount: value })}
        error={errors.amount}
      />
      {/* Other domain-specific fields */}
      <Button type="submit">Save Budget</Button>
    </form>
  );
}
```

#### Domain vs UI Component Distinction

| UI Components | Domain Components |
|---------------|-------------------|
| Generic, reusable across domains | Specific to business domain |
| No business logic | Contains domain logic |
| Style-focused | Behavior-focused |
| `components/ui/Button` | `components/domain/budget/BudgetForm` |

#### Domain Component Examples

**Budget Domain Components:**
```tsx
// components/domain/budget/BudgetList/index.tsx
export function BudgetList({ tenantId }: { tenantId: string }) {
  // Budget-specific data fetching and state management
  // Budget-specific filtering and sorting logic
  // Budget-specific formatting and calculations
}

// components/domain/budget/BudgetChart/index.tsx
export function BudgetChart({ data, period }: BudgetChartProps) {
  // Budget visualization logic
  // Period-based data transformation
  // Budget-specific chart configurations
}
```

**User Domain Components:**
```tsx
// components/domain/user/UserProfile/index.tsx
export function UserProfile({ userId }: { userId: string }) {
  // User-specific profile management
  // Permission-based field visibility
  // User data validation and updates
}

// components/domain/user/UserPermissions/index.tsx
export function UserPermissions({ user, tenant }: UserPermissionsProps) {
  // Role-based permission management
  // Tenant-specific permission rules
  // Permission validation logic
}
```

**Authentication Domain Components:**
```tsx
// components/domain/auth/AuthGuard/index.tsx
export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  // Authentication state management
  // Role-based access control
  // Redirect logic for unauthorized users
}
```

#### Domain Component Composition

Domain components can compose other domain components and UI components:

```tsx
// components/domain/budget/BudgetDashboard/index.tsx
import { BudgetList } from '../BudgetList';
import { BudgetChart } from '../BudgetChart';
import { BudgetSummary } from '../BudgetSummary';

export function BudgetDashboard({ tenantId }: { tenantId: string }) {
  return (
    <div className="budget-dashboard">
      <BudgetSummary tenantId={tenantId} />
      <div className="grid grid-cols-2 gap-6">
        <BudgetChart tenantId={tenantId} />
        <BudgetList tenantId={tenantId} />
      </div>
    </div>
  );
}
```

## Design Patterns

### 1. Server Components First
Leverage React Server Components for:
- Data fetching at the server level
- Reduced client bundle size
- Improved performance and SEO

```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const data = await fetchDashboardData();
  return <DashboardView data={data} />;
}
```

### 2. Client Components for Interactivity
Use `"use client"` directive only when needed:
- User interactions (onClick, onChange)
- Browser APIs (localStorage, geolocation)
- React hooks (useState, useEffect)

```tsx
"use client";
import { useState } from 'react';

export function InteractiveForm() {
  const [data, setData] = useState('');
  // Client-side logic here
}
```

### 3. Route Groups and Layouts
Organize routes with route groups and nested layouts:

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── layout.tsx        # Auth-specific layout
├── (dashboard)/
│   ├── analytics/page.tsx
│   ├── budget/page.tsx
│   └── layout.tsx        # Dashboard layout
└── layout.tsx            # Root layout
```

### 4. Component Composition
Follow composition over inheritance:

```tsx
// Good: Composition pattern
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function DashboardCard({ data }) {
  return (
    <Card title="Dashboard">
      <DashboardContent data={data} />
    </Card>
  );
}
```

### 5. Custom Hooks Architecture
**RULE: All logic and state MUST be implemented in custom hooks. Components should be purely presentational.**

#### Hook Organization Structure
Custom hooks should be located in a `hooks` directory within each component directory:

```
components/
├── ui/
│   ├── Button/
│   │   ├── index.tsx
│   │   ├── Button.types.ts
│   │   └── hooks/
│   │       └── useButtonState.ts
│   └── Modal/
│       ├── index.tsx
│       ├── Modal.types.ts
│       └── hooks/
│           ├── useModal.ts
│           └── useModalAnimation.ts
└── domain/
    ├── budget/
    │   ├── BudgetForm/
    │   │   ├── index.tsx
    │   │   ├── index.test.tsx
    │   │   ├── BudgetForm.types.ts
    │   │   └── hooks/
    │   │       ├── useBudgetForm.ts
    │   │       ├── useBudgetForm.test.ts
    │   │       ├── useBudgetValidation.ts
    │   │       └── useBudgetValidation.test.ts
    │   ├── BudgetList/
    │   │   ├── index.tsx
    │   │   ├── index.test.tsx
    │   │   ├── BudgetList.types.ts
    │   │   └── hooks/
    │   │       ├── useBudgetList.ts
    │   │       └── useBudgetList.test.ts
    │   └── BudgetChart/
    │       ├── index.tsx
    │       ├── index.test.tsx
    │       └── hooks/
    │           ├── useBudgetChart.ts
    │           └── useBudgetChart.test.ts
    ├── user/
    │   ├── UserProfile/
    │   │   ├── index.tsx
    │   │   ├── index.test.tsx
    │   │   └── hooks/
    │   │       ├── useUserProfile.ts
    │   │       ├── useUserProfile.test.ts
    │   │       ├── useProfileValidation.ts
    │   │       └── useProfileValidation.test.ts
    │   └── UserPermissions/
    │       ├── index.tsx
    │       ├── index.test.tsx
    │       └── hooks/
    │           ├── useUserPermissions.ts
    │           └── useUserPermissions.test.ts
    └── auth/
        ├── LoginForm/
        │   ├── index.tsx
        │   ├── index.test.tsx
        │   └── hooks/
        │       ├── useLoginForm.ts
        │       └── useLoginForm.test.ts
        └── AuthGuard/
            ├── index.tsx
            ├── index.test.tsx
            └── hooks/
                ├── useAuth.ts
                └── useAuth.test.ts

# For shared hooks used across multiple components:
hooks/
├── shared/              # Shared utility hooks
│   ├── useApi.ts
│   ├── useDebounce.ts
│   └── usePagination.ts
└── index.ts             # Export barrel for shared hooks
```

#### Hook Rules and Principles

1. **Separation of Logic and Rendering**: Components handle only rendering, hooks handle all logic and state
2. **Single Responsibility**: Each hook has one clear purpose
3. **Co-location**: Hooks are located within the component directory they serve
4. **Export Structure**: Each component's hooks directory should have an index.ts for clean imports

#### Component Hook Structure Example

```tsx
// components/domain/budget/BudgetForm/hooks/useBudgetForm.ts
export function useBudgetForm(initialData?: Budget) {
  // Hook implementation
}

// components/domain/budget/BudgetForm/hooks/useBudgetValidation.ts
export function useBudgetValidation() {
  // Validation logic
}

// components/domain/budget/BudgetForm/hooks/index.ts
export { useBudgetForm } from './useBudgetForm';
export { useBudgetValidation } from './useBudgetValidation';

// components/domain/budget/BudgetForm/index.tsx
import { useBudgetForm, useBudgetValidation } from './hooks';
```


### 6. Error Boundaries and Error Handling
Implement error boundaries at strategic levels:

```tsx
// components/ErrorBoundary.tsx
export function ErrorBoundary({ children }) {
  return (
    <ErrorBoundaryComponent
      fallback={<ErrorFallback />}
    >
      {children}
    </ErrorBoundaryComponent>
  );
}
```

### 7. Loading States and Suspense
Use Suspense for data fetching and loading states:

```tsx
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
```

## Data Fetching Patterns

### Server-Side Data Fetching
Prefer server-side data fetching for initial page loads:

```tsx
// Server Component
async function getServerSideProps() {
  const res = await fetch('http://localhost:8080/api/data');
  return res.json();
}

export default async function Page() {
  const data = await getServerSideProps();
  return <PageContent data={data} />;
}
```

### Client-Side Data Fetching
Use for dynamic interactions and updates:

```tsx
"use client";
import { useState, useEffect } from 'react';

export function ClientDataComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return data ? <DataView data={data} /> : <Loading />;
}
```

## State Management

### 1. React Built-in State
Use React's built-in state management for:
- Component-level state (useState)
- Complex state logic (useReducer)
- Context for prop drilling avoidance

### 2. URL as State
Leverage Next.js routing for state management:
- Search params for filters
- Route parameters for navigation state
- Hash for in-page state

```tsx
// Using searchParams
function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const query = searchParams.q;
  return <SearchResults query={query} />;
}
```

## Performance Optimization

### 1. Code Splitting
Leverage Next.js automatic code splitting and dynamic imports:

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### 2. Image Optimization
Use Next.js Image component:

```tsx
import Image from 'next/image';

function ProfileImage() {
  return (
    <Image
      src="/profile.jpg"
      alt="Profile"
      width={500}
      height={300}
      priority
    />
  );
}
```

### 3. Memoization
Use React memoization strategically:

```tsx
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => processData(data), [data]);
  
  const handleClick = useCallback(() => {
    // Handle click
  }, []);
  
  return <div>{/* Component JSX */}</div>;
});
```

## TypeScript Integration

### 1. Strict Type Checking
Enable strict TypeScript configuration:

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### 2. Component Props Typing
Use proper TypeScript types for props:

```tsx
type ButtonProps = {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

function Button({ variant, size = 'md', children, onClick }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### 3. API Response Types
Define types for API responses:

```tsx
// types/api.ts
export type User = {
  id: string;
  email: string;
  name: string;
}

export type ApiResponse<T> = {
  data: T;
  message: string;
  status: 'success' | 'error';
}
```

## Testing Strategy

### 1. Component Testing
Test components in isolation:

```tsx
// __tests__/Button.test.tsx
import { render, screen } from '@testing-library/react';
import Button from '../Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});
```

### 2. Integration Testing
Test user workflows and component interactions.

### 3. E2E Testing
Test critical user paths with tools like Playwright.

## Accessibility (a11y)

### 1. Semantic HTML
Use proper HTML semantics:

```tsx
function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/reports">Reports</a></li>
      </ul>
    </nav>
  );
}
```

### 2. ARIA Labels
Provide proper ARIA labels for screen readers:

```tsx
function SearchInput() {
  return (
    <input
      type="search"
      aria-label="Search budgets"
      placeholder="Search..."
    />
  );
}
```

## Security Best Practices

### 1. Content Security Policy
Implement CSP headers in next.config.js.

### 2. Authentication
Handle authentication securely:
- Use HTTP-only cookies for tokens
- Implement CSRF protection
- Validate user permissions on both client and server

### 3. Data Sanitization
Sanitize user inputs and prevent XSS:

```tsx
import DOMPurify from 'dompurify';

function UserContent({ content }: { content: string }) {
  const sanitizedContent = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
}
```

## Deployment and Build

### 1. Build Optimization
Configure Next.js for optimal builds:

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
```

### 2. Environment Configuration
Manage environment variables properly:
- Use `.env.local` for development
- Configure production environment variables securely
- Validate environment variables at build time

## Code Quality

### 1. Biome Configuration
Use Biome for consistent formatting and linting:

```json
// biome.json
{
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

### 2. Git Hooks
Implement pre-commit hooks for code quality:
- Format code with Biome
- Type check with TypeScript
- Run linting rules
- Validate commit messages

This architecture ensures maintainable, performant, and scalable frontend code following Next.js and React best practices while integrating seamlessly with the CPM prototype's business requirements.