import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Create from './pages/Create';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Examples from './pages/Examples';
import SEOHead from './components/SEOHead';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <SEOHead />
                  <Home />
                </>
              }
            />
            <Route
              path="/create"
              element={
                <>
                  <SEOHead
                    title="Créer un Fond d'Écran - DotsDaily"
                    description="Créez votre fond d'écran personnalisé pour iPhone. Choisissez parmi année en cours, compte à rebours ou calendrier de vie. Gratuit et illimité."
                  />
                  <Create />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <SEOHead
                    title="À Propos - DotsDaily"
                    description="Découvrez la mission de DotsDaily : aider les gens à visualiser leur temps et à vivre plus intentionnellement avec des fonds d'écran iPhone uniques."
                  />
                  <About />
                </>
              }
            />
            <Route
              path="/faq"
              element={
                <>
                  <SEOHead
                    title="FAQ - Questions Fréquentes | DotsDaily"
                    description="Trouvez des réponses à toutes vos questions sur DotsDaily : utilisation, personnalisation, compatibilité iPhone, mise à jour automatique et plus encore."
                  />
                  <FAQ />
                </>
              }
            />
            <Route
              path="/examples"
              element={
                <>
                  <SEOHead
                    title="Exemples de Fonds d'Écran - DotsDaily"
                    description="Découvrez des exemples de fonds d'écran DotsDaily : année en cours, comptes à rebours, calendriers de vie. Inspirez-vous pour créer le vôtre."
                  />
                  <Examples />
                </>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
