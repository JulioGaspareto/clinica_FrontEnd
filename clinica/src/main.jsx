import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

//react router
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

//toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './layouts/DashboardLayout';
import MedicalRecordList from './components/MedicalRecordList';
import RegisterFormPatient from './components/RegisterFormPatient';
import ConsultationForm from './components/ConsultationForm';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {

    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/prontuarios", element: <MedicalRecordList /> },
      { path: "/pacientes", element: <RegisterFormPatient /> },
      { path: "/consultas", element: <ConsultationForm /> },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ToastContainer />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
