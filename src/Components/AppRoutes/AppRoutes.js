import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "../../Pages/Dashboard/Dashboard";
import ServiceManagement from "../../Pages/Service Management/ServiceManagement";
import RenewalManagement from "../../Pages/Renewal Management/RenewalManagement";
import DocumentManagement from "../../Pages/Document Management/DocumentManagement";
import AnalyticsReporting from "../../Pages/Analytics & Reporting/AnalyticsReporting";
import ComplianceManagement from "../../Pages/Compliance Management/ComplianceManagement";
import UserManagement from "../../Pages/User Management/UserManagement";
import SettingConfigurations from "../../Pages/Setting & Configurations/SettingConfigurations";
import SecurityPrivacy from "../../Pages/Security & Privacy/SecurityPrivacy";
import AddService from "../../Pages/AddService/AddService";
import ContactForm from "../../Pages/ContactForm/ContactForm";
import AllContactForms from "../../Pages/AllContactForms/AllContactForms";
import Phase1 from "../../Pages/Phase1/Phase1";
import Phase1Details from "../../Pages/Phase1 Details/Phase1Details";
import Phase2 from "../../Pages/Phase2/Phase2";
import Phase3 from "../../Pages/Phase3/Phase3";
import Phase4 from "../../Pages/Phase4/Phase4";
import BRNTracking from "../../Pages/Compliance Management/BRN_Tracking/BRNTracking";
import KYCManagement from "../../Pages/Compliance Management/KYC_Management/KYCManagement";
import ComplianceDocumentation from "../../Pages/Compliance Management/ComplianceDocumentation/ComplianceDocumentation";
import RegulatoryMonitoring from "../../Pages/Compliance Management/RegulatoryMonitoring/RegulatoryMonitoring";
import AssignmentForm from "../../Pages/AssignmentForm/AssignmentForm";
import FormBuilder from "../../Pages/ContactForm/FormBuilder";
import AddNewUser from "../../Pages/AddNewUser/AddNewUser";
import UserActivityLog from "../../Pages/UserActivityLog/UserActivityLog";
import Home from "../../Pages/Home/Home";
import RegisterUserHome from "../../Pages/RegisterUserHome/RegisterUserHome";
import UserProfile from "../../Pages/UserProfile/UserProfile";
import ClientManagementDetails from "../../Pages/Client Management Details/ClientManagementDetails";
import ClientManagement from "../../Pages/ClientManagement/ClientManagement";
import Login from "../../Pages/auth/Login";
import Register from "../../Pages/auth/Register";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SheduleList from "../../Pages/SheduleList/SheduleList";
import EditUser from "../../Pages/User Management/EditUser";
import UserRegister from "../../Pages/UserRegister/UserRegister";
import GetServiceForm from "../../Pages/GetServiceForm/GetServiceForm";
import UpdateServiceForm from "../../Pages/UpdateServiceForm/UpdateServiceForm";
import GetAllServiceGrid from "../../Pages/GetAllServiceGrid/GetAllServiceGrid";
import ClientServiceForm from "../../Pages/ClientServiceForm/ClientServiceForm";
import AllRequests from "../../Pages/All-Requests/AllRequests";
import MyRequestForm from "../../Pages/MyRequestForm/MyRequestForm";
import CorrectionForm from "../../Pages/CorrectionForm/CorrectionForm";
import NotificationsClient from "../../Pages/NotificationsClient/NotificationsClient";
import NotificationsAdmin from "../../Pages/NotificationsAdmin/NotificationsAdmin";
import CreateRole from "../../Pages/CreateRole/CreateRole";
import Phase2Details from "../../Pages/Phase2Details/Phase2Details";
import GetUnregisteredClientServices from "../../Pages/GetUnregisteredClientServices/GetUnregisteredClientServices";
import ForgotPassword from "../../Pages/auth/ForgotPassword";
import ResetPassword from "../../Pages/auth/ResetPassword";

function AppRoutes() {
  return (
    <>
      <ToastContainer position="top-center" />

      <Routes>
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />

        <Route path="/admin/dashboard" element={<Dashboard />}></Route>
        <Route
          path="/client-management-details/:id"
          element={<ClientManagementDetails />}
        ></Route>
        <Route
          path="/clientServiceForm"
          element={<ClientServiceForm />}
        ></Route>
        <Route
          path="/notificationsClient"
          element={<NotificationsClient />}
        ></Route>
        <Route
          path="/admin-notifications"
          element={<NotificationsAdmin />}
        ></Route>
        <Route path="/correction-form/:id" element={<CorrectionForm />} />
        <Route path="/my-requests" element={<MyRequestForm />}></Route>
        <Route
          path="/admin/service-details/:serviceId"
          element={<GetServiceForm />}
        />
        <Route
          path="/admin/update-service/:serviceId"
          element={<UpdateServiceForm />}
        />
        <Route path="/admin/CreateRole" element={<CreateRole />} />
        <Route
          path="/admin/service-management"
          element={<ServiceManagement />}
        ></Route>
        <Route path="/admin/all-requests" element={<AllRequests />}></Route>
        <Route
          path="admin/getUnregisteredClientServices"
          element={<GetUnregisteredClientServices />}
        ></Route>

        <Route
          path="/admin/all-services-grid"
          element={<GetAllServiceGrid />}
        ></Route>
        <Route
          path="/admin/renewal-management"
          element={<RenewalManagement />}
        ></Route>
        <Route
          path="/admin/document-management"
          element={<DocumentManagement />}
        ></Route>
        <Route
          path="/admin/analytics-reporting"
          element={<AnalyticsReporting />}
        ></Route>
        <Route
          path="/admin/compliance-management"
          element={<ComplianceManagement />}
        ></Route>
        <Route
          path="/admin/user-management/all-users"
          element={<UserManagement />}
        ></Route>
        <Route
          path="/admin/user-management/add-user"
          element={<AddNewUser />}
        ></Route>
        <Route
          path="/admin/user-management/edit-user"
          element={<EditUser />}
        ></Route>
        <Route
          path="/admin/user-management/activity-log"
          element={<UserActivityLog />}
        ></Route>

        <Route
          path="/admin/settings-configurations"
          element={<SettingConfigurations />}
        ></Route>
        <Route
          path="/admin/security-privacy"
          element={<SecurityPrivacy />}
        ></Route>

        <Route path="/admin/add-service" element={<AddService />}></Route>

        <Route path="/admin/contact-form" element={<ContactForm />}></Route>

        <Route path="/admin/all-contact-forms" element={<AllContactForms />} />

        <Route path="/phase1" element={<Phase1 />} />

        <Route path="/document/:id" element={<Phase1Details />} />
        <Route path="/documents/:id" element={<Phase2Details />} />

        <Route path="/phase2" element={<Phase2 />} />

        <Route path="/phase3" element={<Phase3 />} />

        <Route path="/phase4" element={<Phase4 />} />

        <Route
          path="/admin/compliance-management/brn-tracking"
          element={<BRNTracking />}
        />
        <Route
          path="/admin/compliance-management/kyc-management"
          element={<KYCManagement />}
        />
        <Route
          path="/admin/compliance-management/compliance-documentation"
          element={<ComplianceDocumentation />}
        />
        <Route
          path="/admin/compliance-management/regulatory-monitoring"
          element={<RegulatoryMonitoring />}
        />

        <Route path="/admin/assignment-form" element={<AssignmentForm />} />
        <Route path="/admin/SheduleList" element={<SheduleList />} />

        <Route path="/admin/FormBuilder" element={<FormBuilder />} />
        <Route path="/" element={<Home />} />
        <Route path="/register-user-home" element={<RegisterUserHome />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/admin/client-management" element={<ClientManagement />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="admin/UserRegister" element={<UserRegister />} />
      </Routes>
    </>
  );
}
export default AppRoutes;
