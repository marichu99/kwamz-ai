import { Routes, Route } from 'react-router-dom';
import Dashboard from "./pages/Dashboard"
import Users from './pages/Users';
import LandingPage from './pages/LandingPage';
import DocumentForm from './components/DocumentForm';
import SignupForm from './components/SignUpForm';
import Logout from './components/Logout';
import LoginForm from './components/LoginForm';
import KYCPage from './components/KYCPage';
import './styles/form.css';



const AppRouter = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/users" element={<Users />} />
    <Route path="/documents" element={<DocumentForm />} />
    <Route path="/logout" element={<Logout />} />
    <Route path="/kyc" element={<KYCPage />} />
    <Route path="/signup" element={<SignupForm onSuccess={() => window.location.href = '/dashboard'} />} />
    <Route path="/login" element={<LoginForm onSuccess={() => window.location.href = '/dashboard'} />} />
  </Routes>
);

export default AppRouter;