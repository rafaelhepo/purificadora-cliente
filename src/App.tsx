import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import RDODP from "./pages/RDODP";
import RDEDE from "./pages/RDEDE";
import RDLYDDA from "./pages/RDLYDDA";
import RPLYDDE from "./pages/RPLYDDE";
import RDAPDA from "./pages/RDAPDA";
import RPLLYDDV from "./pages/RPLLYDDV";
import RDPEPS from "./pages/RDPEPS";
import MDCRYAC from "./pages/MDCRYAC";
import RDMDE from "./pages/RDMDE";
import MDD from "./pages/MDD";
import CDC from "./pages/CDC";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/monitoreo-de-cloro-residual-y-analisis-coliformes" element={<MDCRYAC />} />
        <Route path="/registro-para-la-limpieza-y-desinfeccion-de-equipos" element={<RPLYDDE />} />
        <Route path="/registro-de-evaluacion-de-envases" element={<RDEDE />} />
        <Route path="/registro-de-analisis-periodico-del-agua" element={<RDAPDA />} />
        <Route path="/registro-de-primeras-entradas-primeras-salidas" element={<RDPEPS />} />
        <Route path="/registro-de-ordenes-de-produccion" element={<RDODP />} />
        <Route path="/registro-para-la-limpieza-y-desinfeccion-de-areas" element={<RDLYDDA />} />
        <Route path="/registro-para-la-limpieza-y-desinfeccion-de-vehiculos" element={<RPLLYDDV />} />
        <Route path="/registro-de-mantenimiento-de-equipo" element={<RDMDE />} />
        <Route path="/metodo-de-desinfeccion" element={<MDD />} />
        <Route path="/concentracion-de-cloro" element={<CDC />} />
      </Routes>
    </Router>
  );
}