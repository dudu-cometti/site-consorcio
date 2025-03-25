import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const PrivateRoute = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  // Se não estiver autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Se autenticado, renderiza as rotas filhas
  return children;
};

export default PrivateRoute;