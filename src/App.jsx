import { useApp } from './store/AppContext.jsx';
import { getColors } from './lib/theme.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Wizard from './components/wizard/Wizard.jsx';
import Comparator from './components/comparator/Comparator.jsx';
import GuideRoute from './components/guide/GuideRoute.jsx';
import Buy from './components/buy/Buy.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const { state } = useApp();
  const c = getColors(state.theme);

  return (
    <div style={{ fontFamily: "'Noto Sans',system-ui,sans-serif", minHeight: '100vh', overflowX: 'hidden', background: c.pageBg, color: c.ink, transition: 'background .5s ease,color .5s ease' }}>
      <Header />
      <Hero />
      <Wizard />
      <Comparator />
      <GuideRoute />
      <Buy />
      <Footer />
    </div>
  );
}
