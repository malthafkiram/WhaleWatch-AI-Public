import { useSelector } from "react-redux";
import { Navigate } from "react-router";

/** Redirect authenticated users away from login/register */
export default function GuestRoute({ children }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}
