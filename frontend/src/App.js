import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

//Components
import Sidebar from './components/layout/Sidebar';
import Container from './components/layout/Container';
import Footer from './components/layout/Footer';
import Message from './components/layout/Message';

//Pages
import Home from './components/pages/Home';
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

function App() {
  return (
    <Router>
      <Sidebar />

      <Message />
      <Container>
        <Routes>
          <Route path="/customers/messages" element={<CustomerMessages />} />
          <Route path="/customers/add" element={<CustomerAdd />} />
          <Route path="/customers/edit/:id" element={<CustomerEdit />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/config/payments/add" element={<ConfigPaymentsAdd />} />
          <Route path="/config/payments/edit/:id" element={<ConfigPaymentsEdit />} />
          <Route path="/config/payments" element={<ConfigPayments />} />
          <Route path="/config/procedures/add" element={<ConfigProceduresAdd />} />
          <Route path="/config/procedures/edit/:id" element={<ConfigProceduresEdit />} />
          <Route path="/config/procedures" element={<ConfigProcedures />} />
          <Route path="/schedule/add/:id" element={<ScheduleAdd />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/verifymessages" element={<VerifyMessages />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
      <Footer />

    </Router>
  );
}

export default App;
