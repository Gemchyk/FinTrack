import { Navigate, Outlet } from "react-router";
import{ jwtDecode } from 'jwt-decode';


function isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; 
      console.log(decoded.exp);
      console.log(currentTime);
      return decoded.exp < currentTime;
    } catch (e) {
      return true; 
    }
  }

function PrivateRoute() {
  const token = localStorage.getItem('token');
  return isTokenExpired(token) ? <Navigate to="/" replace /> : <Outlet />;
}

export default PrivateRoute;