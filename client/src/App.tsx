import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import SellPage from './pages/SellPage'
import AboutPage from './pages/AboutPage'

// Create a root route
const rootRoute = createRootRoute({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
})

// Create the home route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

// Create routes for other pages
const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/browse',
  component: BrowsePage,
})

const sellRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sell',
  component: SellPage,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

// Create the route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  browseRoute,
  sellRoute,
  aboutRoute,
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
