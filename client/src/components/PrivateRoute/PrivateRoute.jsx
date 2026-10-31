import { Navigate, Outlet } from "react-router";


function isTokenExpired(token) {
    try {
      // The payload is base64url: atob throws on its '-' and '_' without this mapping
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const { exp } = JSON.parse(atob(payload));
      const currentTime = Date.now() / 1000;
      return exp < currentTime;
    } catch {
      return true;
    }
  }

function PrivateRoute() {
  const token = localStorage.getItem('token');
  return isTokenExpired(token) ? <Navigate to="/" replace /> : <Outlet />;
}

export default PrivateRoute;