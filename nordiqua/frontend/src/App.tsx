import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Invoices } from './pages/Invoices';
import { Clients } from './pages/Clients';
import { Products } from './pages/Products';
import { Settings } from './pages/Settings';
import { useAuthStore } from './store/useAuthStore';

// Composant pour gérer les redirections basées sur l'authentification
function AuthRedirect() {
  const { user } = useAuthStore();
  const location = useLocation();

  // Si l'utilisateur est authentifié et qu'il essaie d'accéder à la page d'accueil,
  // le rediriger vers le tableau de bord
  if (user && location.pathname === '/') {
    return <Navigate to="/dashboard" replace />;
  }

  // Si l'utilisateur n'est pas authentifié et qu'il essaie d'accéder à une route protégée,
  // le rediriger vers la page de connexion
  if (
    !user &&
    location.pathname !== '/landing' &&
    location.pathname !== '/register'
  ) {
    return <Navigate to="/login" replace />;
  }

  return null;
}

function App() {
  const { user, initSession, loading } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      await initSession();
    };
    init();
  }, [initSession]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <AuthRedirect />
      <Routes>
        {/* Route racine avec redirection */}
        <Route
          path="/"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Routes publiques */}
        <Route
          path="/landing"
          element={
            <>
              <Navbar />
              <Landing />
            </>
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Routes protégées */}
        <Route
          path="/dashboard"
          element={
            user ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/invoices"
          element={
            user ? (
              <Layout>
                <Invoices />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/clients"
          element={
            user ? (
              <Layout>
                <Clients />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/products"
          element={
            user ? (
              <Layout>
                <Products />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/settings"
          element={
            user ? (
              <Layout>
                <Settings />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirection pour les routes inconnues */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
