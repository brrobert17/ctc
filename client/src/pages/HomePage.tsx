import { Link } from '@tanstack/react-router'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Car Trading Companion</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-500 hover:text-gray-900">Home</Link>
              <Link to="/browse" className="text-gray-500 hover:text-gray-900">Browse Cars</Link>
              <Link to="/sell" className="text-gray-500 hover:text-gray-900">Sell Your Car</Link>
              <Link to="/about" className="text-gray-500 hover:text-gray-900">About</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Find Your Perfect
            <span className="text-indigo-600"> Used Car</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Your trusted companion for buying and selling quality used cars. 
            Browse thousands of verified listings or sell your car with confidence.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/browse"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Browse Cars
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                to="/sell"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Sell Your Car
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                🔍
              </div>
              <h3 className="text-lg font-medium text-gray-900">Advanced Search</h3>
              <p className="mt-2 text-base text-gray-500">
                Filter by make, model, year, price, and more to find exactly what you're looking for.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                ✅
              </div>
              <h3 className="text-lg font-medium text-gray-900">Verified Listings</h3>
              <p className="mt-2 text-base text-gray-500">
                All our listings are verified for authenticity and accuracy to ensure your peace of mind.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white mb-4">
                💰
              </div>
              <h3 className="text-lg font-medium text-gray-900">Best Prices</h3>
              <p className="mt-2 text-base text-gray-500">
                Get the best deals on quality used cars with our competitive pricing and negotiation tools.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
