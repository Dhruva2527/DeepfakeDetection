import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import SiteLayout from '@/components/SiteLayout';
import Landing from '@/pages/Landing';
import Analyze from '@/pages/Analyze';
import HowItWorks from '@/pages/HowItWorks';
import About from '@/pages/About';

const AppRoutes = () => (
  <Routes>
    <Route element={<SiteLayout />}>
      <Route path="/" element={<Landing />} />
      <Route path="/analyze" element={<Analyze />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/about" element={<About />} />
    </Route>
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AppRoutes />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App