import LoginScreen from "@/app/login";
import { useUserContext } from "@/context/UserContext";
import AuthenticatedApp from "./AuthenticatedApp";
import ErrorScreen from "./ui/ErrorScreen";
import LoadingScreen from "./ui/LoadingScreen";

export default function App() {
  const { user } = useUserContext();

  if (user.loading) {
    return <LoadingScreen />;
  }

  if ("error" in user && user.error) {
    return <ErrorScreen error={user.error} />;
  }

  if (!user.isLoggedIn) {
    return <LoginScreen />;
  }

  return <AuthenticatedApp />;
}
