import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Result } from './pages/Result';
import { About } from './pages/About';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import { SafetyChecker } from './pages/SafetyChecker';
import { Compare } from './pages/Compare';
import { Pharmacies } from './pages/Pharmacies';
import { Prescription } from './pages/Prescription';
import { Chat } from './pages/Chat';
import { BlogDetail } from './pages/BlogDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="result" element={<Result />} />
          <Route path="about" element={<About />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="safety" element={<SafetyChecker />} />
          <Route path="compare" element={<Compare />} />
          <Route path="pharmacies" element={<Pharmacies />} />
          <Route path="prescription" element={<Prescription />} />
          <Route path="chat" element={<Chat />} />
          <Route path="blog/:id" element={<BlogDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
