import { Link, useLocation } from "react-router-dom";

export default function Menu() {
  
  console.log('carga menu con exito');
  const location = useLocation();
  const nombre = (location.state as { nombre?: string })?.nombre || "";

  return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center", // Centrado vertical
      alignItems: "center",     // Centrado horizontal
      minHeight: "100vh",       // Ocupa toda la altura de la pantalla
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#121212",
      color: "white",
      boxSizing: "border-box",
      textAlign: "center",
    }}
  >
    <h2 style={{ margin: "0 0 30px", fontSize: "1.5rem", fontWeight: "600" }}>
      Formatos Salubridad
    </h2>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "95%",             // Ocupa casi todo el ancho
        maxWidth: "500px",        // Pero no se desmadra en tablets
        padding: "10px",
      }}
    >
      {[
        { path: "/monitoreo-de-cloro-residual-y-analisis-coliformes", label: "Monitoreo de Cloro Residual y Analisis Coliformes" },
        { path: "/registro-para-la-limpieza-y-desinfeccion-de-equipos", label: "Registro para Limpieza y Desinfección de Equipos" },
        { path: "/registro-de-evaluacion-de-envases", label: "Registro de Evaluación de Envases" },
        { path: "/registro-de-analisis-periodico-del-agua", label: "Registro de Análisis Periódico del Agua" },
        { path: "/registro-de-primeras-entradas-primeras-salidas", label: "Registro de Primeras Entradas Primeras Salidas" },
        { path: "/registro-de-mantenimiento-de-equipo", label: "Registro de Mantenimiento de Equipo" },
        /*{ path: "/registro-de-ordenes-de-produccion", label: "Registro de Órdenes de Producción" },*/
        /*{ path: "/registro-para-la-limpieza-y-desinfeccion-de-areas", label: "Registro para Limpieza y Desinfección de Áreas" },*/
        /*{ path: "/registro-para-la-limpieza-y-desinfeccion-de-vehiculos", label: "Registro para la Limpieza de Vehículos" },*/
        /*{ path: "/metodo-de-desinfeccion", label: "Método de Desinfección" },*/
        /*{ path: "/concentracion-de-cloro", label: "Concentración de Cloro" },*/
      ].map((item) => (
        <Link to={item.path} state={{ nombre }} key={item.path}>
          <button
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "1.1rem",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "12px",
              textAlign: "left",
              whiteSpace: "normal",
              wordBreak: "break-word",
              lineHeight: "1.5",
              fontWeight: "500",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              transition: "transform 0.1s, background-color 0.2s",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            📄 {item.label}
          </button>
        </Link>
      ))}
    </div>
  </div>
);
}
