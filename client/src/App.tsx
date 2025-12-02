import { createRouter, RouterProvider, createRoute, createRootRoute } from '@tanstack/react-router'
import AppLayout from './components/layout/AppLayout'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import CarDetailPage from './pages/CarDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

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

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  browseRoute,
  carDetailRoute,
  loginRoute,
  signupRoute,
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
  return <RouterProvider router={router} />
}

export default App
