import { Link, Route, Routes } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReceivingPage } from './pages/ReceivingPage';
import { QualityPage } from './pages/QualityPage';
import { ProductionPage } from './pages/ProductionPage';
import { PalletPage } from './pages/PalletPage';
import { ShippingPage } from './pages/ShippingPage';
import { TraceabilityPage } from './pages/TraceabilityPage';

const links = [
  ['/', 'Login'],
  ['/dashboard', 'Dashboard'],
  ['/receiving', 'Ricezione'],
  ['/quality', 'QC'],
  ['/production', 'Produzione'],
  ['/palletization', 'Pallet'],
  ['/shipping', 'Spedizioni'],
  ['/traceability', 'Tracciabilità']
];

export function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 16 }}>
      <h1>ERP Packhouse</h1>
      <nav style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {links.map(([href, label]) => (
          <Link key={href} to={href}>{label}</Link>
        ))}
      </nav>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/receiving" element={<ReceivingPage />} />
        <Route path="/quality" element={<QualityPage />} />
        <Route path="/production" element={<ProductionPage />} />
        <Route path="/palletization" element={<PalletPage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/traceability" element={<TraceabilityPage />} />
      </Routes>
    </div>
  );
}
