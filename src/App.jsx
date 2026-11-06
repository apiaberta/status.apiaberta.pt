import { Navigate, Route, Routes } from 'react-router-dom';
import StatusPage from './pages/StatusPage.jsx';
import UptimePage from './pages/UptimePage.jsx';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<StatusPage />} />
            <Route path="/uptime" element={<UptimePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
