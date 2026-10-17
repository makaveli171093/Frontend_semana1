import PaginaDashboard from "./pages/PaginaDashboard";
import { PaginaPacientes } from "./pages/PaginaPacientes";
import { PaginaNuevaCita } from "./pages/PaginaNuevaCita";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaDashboard />} />
      <Route path="/pacientes" element={<PaginaPacientes />} />
      <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
    </Routes>
  );
}

export default App;
