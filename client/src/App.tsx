import { createRouter, RouterProvider, createRoute, createRootRoute } from '@tanstack/react-router'
import { AuthProvider } from './contexts/AuthContext'
import { ComparisonProvider } from './contexts/ComparisonContext'
import { FilterProvider } from './context/FilterContext'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import CarDetailPage from './pages/CarDetailPage'
import EstimationPage from './pages/EstimationPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AuthCallbackPage from './pages/AuthCallbackPage'
import ProfilePage from './pages/ProfilePage'
import SavedEstimationsPage from './pages/SavedEstimationsPage'
import ComparisonPage from './pages/ComparisonPage'
import PricingPage from './pages/PricingPage'
import CheckoutSuccessPage from './pages/CheckoutSuccessPage'

// Create a root route with shared layout
const rootRoute = createRootRoute({
  component: () => (
    <AppLayout />
  ),
})

// Define routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/browse',
  component: BrowsePage,
})

const estimationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/estimate',
  component: EstimationPage,
})

const carDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/listing/$carId',
  component: CarDetailPage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: SignupPage,
})

const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: AuthCallbackPage,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
})

const savedEstimationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/saved-estimations',
  component: SavedEstimationsPage,
})

const compareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compare',
  component: ComparisonPage,
})

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pricing',
  component: PricingPage,
})

const checkoutSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/success',
  component: CheckoutSuccessPage,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  browseRoute,
  estimationRoute,
  carDetailRoute,
  loginRoute,
  signupRoute,
  authCallbackRoute,
  profileRoute,
  savedEstimationsRoute,
  compareRoute,
  pricingRoute,
  checkoutSuccessRoute,
])

// Create the router
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <AuthProvider>
      <ComparisonProvider>
        <FilterProvider>
          <RouterProvider router={router} />
        </FilterProvider>
      </ComparisonProvider>
    </AuthProvider>
  )
}

export default App
