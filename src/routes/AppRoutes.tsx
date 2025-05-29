import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Index';
import AddAccount from '../pages/Dashboard/AddAccount';
import EditAccount from '../pages/Dashboard/EditAccount';
import Security from '../pages/Settings/Security';
import Theme from '../pages/Settings/Theme';
import Sync from '../pages/Settings/Sync';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add" element={<AddAccount />} />
      <Route path="/edit/:id" element={<EditAccount />} />
      <Route path="/settings">
        <Route path="security" element={<Security />} />
        <Route path="theme" element={<Theme />} />
        <Route path="sync" element={<Sync />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
