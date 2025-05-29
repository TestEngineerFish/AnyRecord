import { Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Index';
import AddAccount from '../pages/Dashboard/AddAccount';
import EditAccount from '../pages/Dashboard/EditAccount';
import Settings from '../pages/Dashboard/Settings';

const DashboardRoutes = () => {
  return (
    <>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add" element={<AddAccount />} />
      <Route path="/edit/:id" element={<EditAccount />} />
      <Route path="/settings" element={<Settings />} />
    </>
  );
};

export default DashboardRoutes; 