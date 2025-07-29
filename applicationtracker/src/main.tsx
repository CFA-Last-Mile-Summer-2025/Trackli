import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App'
import ApplicationsPage from './pages/ApplicationsPage'
import ResumeBuilderPage from './pages/ResumeBuilderPage'
import StatisticsPage from './pages/StatisticsPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import LandingPage from './pages/LandingPage'

const router = createBrowserRouter([{
  path: '/landing',
  element: <LandingPage/>
},{
  path: '/',
  element: <DashboardPage/>
},{
  path: '/applications',
  element: <ApplicationsPage/>
},{
  path: '/resumebuilder',
  element: <ResumeBuilderPage/>
},{
  path: '/jobs',
  element: <App/>
},{
  path: '/settings',
  element: <SettingsPage/>
},{
  path: '/login',
  element: <LoginPage/>
},{
  path: '/signup',
  element: <SignupPage/>
},{
  // path: '/applications/:applicationId', /* take in id of application, list application # at end of url - dynamic routing */
  // element: 
}]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider router = { router } />
  </StrictMode>,
)
