import "./App.css";
import AppFooter from "./Components/AppFooter/AppFooter";
import AppHeader from "./Components/AppHeader/AppHeader";
import PageContent from "./Components/PageContent/PageContent";
import SideMenu from "./Components/SideMenu/SideMenu";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Remove this line if unused
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();

  // Update this line to check if the route is for reset password, ignoring the reset token
  const noHeaderAndMenuRoutes = [
    "/",
    "/login",
    "/register",
    "/register-user-home",
    "/notificationsClient",
    "/my-requests",
    "/user-profile",
    "/clientServiceForm",
    "/forgotpassword",
  ];

  // Use `startsWith` for dynamic matching of reset password route with any token
  const isNoHeaderAndMenu =
    noHeaderAndMenuRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/resetpassword/");

  return (
    <div className="App">
      {/* Ensure only one ToastContainer is rendered */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      {/* Only render header, side menu, and footer if it's not a reset password route */}
      {!isNoHeaderAndMenu && <AppHeader />}
      <div className="MainContent">
        {!isNoHeaderAndMenu && <SideMenu className="SideMenu" />}
        <PageContent className="PageContent" />
      </div>
      {!isNoHeaderAndMenu && <AppFooter />}
    </div>
  );
}

export default App;
