import { Link } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [nombre, setNombre] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [error, setError] = useState("");

  // Lista de nombres válidos
  const nombresValidos = [ 'Juan Pablo Sanchez Mares', 'juan pablo sanchez mares', 'JUAN PABLO SANCHEZ MARES', 'Juan Pablo Sánchez Mares', 'Rafa' ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const nombreNormalizado = nombre.trim();

  if (nombresValidos.includes(nombreNormalizado)) {
    setConfirmado(true);
    setError("");
  } else {
    setError("⚠️ Nombre no válido, intente de nuevo.");
  }
};

  // Si todavía no se confirmó el nombre, muestra el formulario
  if (!confirmado) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>💧 Purificadora de agua Juan Pablo Sánchez Mares</h1>
        <p>Por favor ingresa tu nombre:</p>
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Escribe tu nombre..."
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "200px",
            }}
          />
          <br />
          <button
            type="submit"
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#2d9cdb",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Continuar
          </button>
        </form>
        {error && (
          <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
        )}
      </div>
    );
  }

  // Si ya confirmó el nombre, muestra la página original
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>🥇 JDS Forms</h1>
      <p>Sistema de reportes y control</p>
      <p>
        <strong>Bienvenido</strong> {nombre}
      </p>
      <Link to="/menu" state={{ nombre }}>
        <button
          style={{
            padding: "10px 20px",
            fontSize: "1rem",
            backgroundColor: "#2d9cdb",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Ingresar
        </button>
      </Link>
    </div>
  );
}
