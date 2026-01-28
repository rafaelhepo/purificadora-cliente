import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLocation } from "react-router-dom";

type Metodo = {
  fecha: string;
  tinacos: string;
  desinfectante: string;
  cantidad: string;
  hora: {
    de: string;
    a: string;
  };
  realizo: string;
  observaciones: string;
};

export default function MDD() {
  const location = useLocation();
  const nombreUsuario = (location.state as { nombre?: string })?.nombre || "";

  const [metodos, setMetodos] = useState<Metodo[]>([
    {
      fecha: "",
      tinacos: "",
      desinfectante: "6%",
      cantidad: "55 ml",
      hora: { de: "", a: "" },
      realizo: nombreUsuario,
      observaciones: "",
    },
  ]);

  // Agregar un nuevo día (máx 12)
  const agregarDia = () => {
    if (metodos.length < 12) {
      setMetodos([
        ...metodos,
        {
          fecha: "",
          tinacos: "",
          desinfectante: "6%",
          cantidad: "55 ml",
          hora: { de: "", a: "" },
          realizo: nombreUsuario,
          observaciones: "",
        },
      ]);
    } else {
      alert("Solo se pueden registrar hasta 12 días. (2 semanas)");
    }
  };

  // Manejar cambios en campos simples
  const handleChange = (
    index: number,
    field: keyof Omit<Metodo, "hora">,
    value: string
  ) => {
    const nuevosMetodos = [...metodos];
    nuevosMetodos[index][field] = value;
    setMetodos(nuevosMetodos);
  };

  // Manejar cambios en campos de hora (de / a)
  const handleHoraChange = (
    index: number,
    tipo: "de" | "a",
    value: string
  ) => {
    const nuevosMetodos = [...metodos];
    nuevosMetodos[index].hora[tipo] = value;
    setMetodos(nuevosMetodos);
  };

  // Generar PDF
  const generarPDF = async () => {
    try {
      const doc = new jsPDF();

      const logo = await fetch("/lafuente.png");
      const logoBlob = await logo.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const imgData = reader.result as string;

        const pageWidth = doc.internal.pageSize.getWidth();
        const logoWidth = 25;
        const logoHeight = 25;
        const xPos = (pageWidth - logoWidth) / 2;

        doc.addImage(imgData, "PNG", xPos, 10, logoWidth, logoHeight);

        doc.setFontSize(16);
        doc.text("Metodo De Desinfección", pageWidth / 2, 40, {
          align: "center",
        });

        autoTable(doc, {
          startY: 50,
          head: [
            [
              "Fecha",
              "Tinacos",
              "Desinfectante Hipoclorito",
              "Cantidad",
              "Hora (de - a)",
              "Realizó",
              "Observaciones",
            ],
          ],
          body: metodos.map((r) => [
            r.fecha,
            r.tinacos,
            r.desinfectante,
            r.cantidad,
            `${r.hora.de} - ${r.hora.a}`,
            r.realizo,
            r.observaciones,
          ]),
          theme: "grid",
          headStyles: { fillColor: [52, 152, 219], textColor: 255 },
          bodyStyles: { fillColor: [245, 251, 255] },
        });

        doc.save("reporte.pdf");
      };

      reader.readAsDataURL(logoBlob);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Ocurrió un error al generar el PDF.");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#eef2f6",
        minHeight: "100vh",
      }}
    >
      <img
        src="/lafuente.png"
        alt="Logo Purificadora"
        style={{
          maxWidth: "120px",
          height: "auto",
          marginBottom: "15px",
        }}
      />

      <h2 style={{ color: "#1c3853", marginBottom: "20px" }}>
        Metodo De Desinfección
      </h2>

      {metodos.map((registro, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "15px",
            marginBottom: "20px",
            backgroundColor: "#656fdd",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          <input
            type="date"
            value={registro.fecha}
            onChange={(e) => handleChange(index, "fecha", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="Tinacos (1,2,3...)"
            value={registro.tinacos}
            onChange={(e) => handleChange(index, "tinacos", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="Desinfectante (ej. 6%)"
            value={registro.desinfectante}
            onChange={(e) => handleChange(index, "desinfectante", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="Cantidad (ej. 55 ml)"
            value={registro.cantidad}
            onChange={(e) => handleChange(index, "cantidad", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          {/* HORA: DESDE Y HASTA EN DOS INPUTS */}
          <div style={{ display: "flex", gap: "8px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", textAlign: "left", color: "#fff", fontWeight: "bold" }}>
                Desde:
              </label>
              <input
                type="time"
                value={registro.hora.de}
                onChange={(e) => handleHoraChange(index, "de", e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #2980b9",
                  outline: "none",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", textAlign: "left", color: "#fff", fontWeight: "bold" }}>
                Hasta:
              </label>
              <input
  type="time"
  value={registro.hora.a}
  onChange={(e) => handleHoraChange(index, "a", e.target.value)}
  style={{
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #2980b9",
    outline: "none",
    boxSizing: "border-box",
    maxWidth: "100%", // ¡Importante!
    minWidth: "100px", // Evita que sea demasiado pequeño
    fontSize: "14px", // Reduce un poco el tamaño del texto
  }}
/>
            </div>
          </div>

          <input
            type="text"
            placeholder="Realizó"
            value={registro.realizo}
            readOnly
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
              backgroundColor: "#0a0909",
            }}
          />

          <input
            type="text"
            placeholder="Observaciones"
            value={registro.observaciones}
            onChange={(e) => handleChange(index, "observaciones", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />
        </div>
      ))}

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={agregarDia}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "8px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          Agregar Día
        </button>

        <button
          onClick={generarPDF}
          style={{
            padding: "10px 20px",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Generar PDF
        </button>
      </div>
    </div>
  );
}