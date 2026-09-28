import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  return (
    <nav className="h-20 border-b border-gray-200 flex items-center justify-between px-5 md:px-8">

      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <span className="flex items-center justify-center w-8 h-8 text-lg text-white rounded-md font-bold bg-blue-600">
          D
        </span>

        <span className="text-xl font-bold text-gray-900">
          DocuBot
        </span>
      </div>


      {/* Navigation */}
      <div className="hidden md:block">
        <ul className="flex items-center gap-8 text-sm text-[#4b5468]">
          <li className="cursor-pointer hover:text-blue-600 transition" onClick={() => navigate('/pricing')}>
            Pricing
          </li>
        </ul>
      </div>


      {/* Actions */}
      <div>
        <ul className="flex items-center gap-3">
          {isAuthenticated ? (
            <li
              className="cursor-pointer px-3 py-2 bg-[#1b3fd1] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </li>
          ) : (
            <>
              <li
                className="hidden md:block cursor-pointer border border-[#4b5468] px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition"
                onClick={() => navigate('/login')}
              >
                Login
              </li>

              <li
                className="cursor-pointer px-3 py-2 bg-[#1b3fd1] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                onClick={() => navigate('/signup')}
              >
                Get started
              </li>
            </>
          )}
        </ul>
      </div>

    </nav>
  )
}

export default Navbar
