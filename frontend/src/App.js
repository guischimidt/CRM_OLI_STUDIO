import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useContext } from 'react';

//Components
import Sidebar from './components/layout/Sidebar';
import Container from './components/layout/Container';
import Footer from './components/layout/Footer';
import Message from './components/layout/Message';

//Pages
import Home from './components/pages/Home';
import Login from './components/pages/Auth/Login';
import Customers from './components/pages/Customers/Customers';
import CustomerMessages from './components/pages/Customers/CustomerMessages';
import CustomerAdd from './components/pages/Customers/CustomerAdd';
import CustomerEdit from './components/pages/Customers/CustomerEdit';
import ConfigPayments from './components/pages/Config/ConfigPayments';
import ConfigPaymentsAdd from './components/pages/Config/ConfigPaymentsAdd';
import ConfigPaymentsEdit from './components/pages/Config/ConfigPaymentsEdit';
import ConfigProcedures from './components/pages/Config/ConfigProcedures';
import ConfigProceduresAdd from './components/pages/Config/ConfigProceduresAdd';
import ConfigProceduresEdit from './components/pages/Config/ConfigProceduresEdit';
import Schedule from './components/pages/Schedule/Schedules';
import ScheduleAdd from './components/pages/Schedule/ScheduleAdd';
import VerifyMessages from './components/VerifyMessages';

import { UserProvider, Context } from './context/UserContext'

const PrivateRoute = ({ children }) => {
  const { authenticated } = useContext(Context);

  return (
    authenticated ? (children) : (<Navigate to="/login" />)
  )
};

function App() {
  return (
    <Router>
      <UserProvider>
        <Sidebar />
        <Message />
        <Container>
          <Routes>
            <Route path="/customers/messages" element={<PrivateRoute><CustomerMessages /></PrivateRoute>} />
            <Route path="/customers/add" element={<PrivateRoute><CustomerAdd /></PrivateRoute>} />
            <Route path="/customers/edit/:id" element={<PrivateRoute><CustomerEdit /></PrivateRoute>} />
            <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
            <Route path="/config/payments/add" element={<PrivateRoute><ConfigPaymentsAdd /></PrivateRoute>} />
            <Route path="/config/payments/edit/:id" element={<PrivateRoute><ConfigPaymentsEdit /></PrivateRoute>} />
            <Route path="/config/payments" element={<PrivateRoute><ConfigPayments /></PrivateRoute>} />
            <Route path="/config/procedures/add" element={<PrivateRoute><ConfigProceduresAdd /></PrivateRoute>} />
            <Route path="/config/procedures/edit/:id" element={<PrivateRoute><ConfigProceduresEdit /></PrivateRoute>} />
            <Route path="/config/procedures" element={<PrivateRoute><ConfigProcedures /></PrivateRoute>} />
            <Route path="/schedule/add/:id" element={<PrivateRoute><ScheduleAdd /></PrivateRoute>} />
            <Route path="/schedule" element={<PrivateRoute><Schedule /></PrivateRoute>} />
            <Route path="/verifymessages" element={<VerifyMessages />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          </Routes>
        </Container>
      </UserProvider>
      <Footer />
    </Router>
  );
}

export default App;
