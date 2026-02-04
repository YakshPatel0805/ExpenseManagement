import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/index";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Wallets from "./pages/wallets";
import Dashboard from "./pages/dashboard";
import Expense from "./pages/expense";
import Accounts from "./pages/accounts";
import Settings from "./pages/settings";
import Summary from "./pages/summary";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
          <Route path="/expenses" element={ <ProtectedRoute> <Expense /> </ProtectedRoute> } />
          <Route path="/wallets" element={ <ProtectedRoute> <Wallets /> </ProtectedRoute> } />
          <Route path="/summary" element={ <ProtectedRoute> <Summary /> </ProtectedRoute> } />
          <Route path="/accounts" element={ <ProtectedRoute> <Accounts /> </ProtectedRoute> } />
          <Route path="/settings" element={ <ProtectedRoute> <Settings /> </ProtectedRoute> } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
