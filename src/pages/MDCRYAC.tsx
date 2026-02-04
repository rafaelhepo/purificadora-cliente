import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useLocation } from "react-router-dom";

type Metodo = {
  fecha: string;
  hora: {
    de: string;
    a: string;
  };
  puntoDeMuestreo: string;
  metodo: string;
  cloroResidual: string;
  ph: string;
  coliformesTotales: string;
  coliformesFecales: string;
  realizo: string;
  observaciones: string;
};

export default function MDCRYAC() {
  const location = useLocation();
  const nombreUsuario = (location.state as { nombre?: string })?.nombre || "";

  const [metodos, setMetodos] = useState<Metodo[]>([
    {
      fecha: "",
      puntoDeMuestreo: "",
      metodo: "",
      cloroResidual: "",
      ph: "",
      coliformesTotales: "",
      coliformesFecales: "",
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
          puntoDeMuestreo: "",
          metodo: "",
          cloroResidual: "",
          ph: "",
          coliformesTotales: "",
          coliformesFecales: "",
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
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(16);
      doc.text("Registro de Análisis Periódico del Agua", pageWidth / 2, 20, {
        align: "center",
      });

      autoTable(doc, {
        startY: 30,
        head: [
          [
            "Fecha",
            "Hora (de - a)",
            "Punto de Muestreo",
            "Método",
            "Cloro Residual",
            "pH",
            "Coliformes Totales",
            "Coliformes Fecales",
            "Realizó",
            "Observaciones",
          ],
        ],
        body: metodos.map((r) => [
          r.fecha,
          `${r.hora.de} - ${r.hora.a}`,
          r.puntoDeMuestreo,
          r.metodo,
          r.cloroResidual,
          r.ph,
          r.coliformesTotales,
          r.coliformesFecales,
          r.realizo,
          r.observaciones,
        ]),
        theme: "grid",
        headStyles: { 
          fillColor: [52, 152, 219], 
          textColor: 255,
          fontSize: 10
        },
        bodyStyles: { 
          fillColor: [245, 251, 255],
          fontSize: 8
        },
        styles: { 
          fontSize: 8,
          cellPadding: 2,
          overflow: 'linebreak'
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 30 },
          2: { cellWidth: 30 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 15 },
          6: { cellWidth: 30 },
          7: { cellWidth: 30 },
          8: { cellWidth: 25 },
          9: { cellWidth: 40 }
        }
      });

      doc.save("analisis_agua.pdf");
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
      <h2 style={{ color: "#1c3853", marginBottom: "20px" }}>
        Registro de Análisis Periódico del Agua
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
            maxWidth: "500px",
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
                }}
              />
            </div>
          </div>

          <input
            type="text"
            placeholder="Punto de Muestreo"
            value={registro.puntoDeMuestreo}
            onChange={(e) => handleChange(index, "puntoDeMuestreo", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="Método"
            value={registro.metodo}
            onChange={(e) => handleChange(index, "metodo", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="Cloro Residual"
            value={registro.cloroResidual}
            onChange={(e) => handleChange(index, "cloroResidual", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="pH"
            value={registro.ph}
            onChange={(e) => handleChange(index, "ph", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="Coliformes Totales"
            value={registro.coliformesTotales}
            onChange={(e) => handleChange(index, "coliformesTotales", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="text"
            placeholder="Coliformes Fecales"
            value={registro.coliformesFecales}
            onChange={(e) => handleChange(index, "coliformesFecales", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

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
              color: "#fff",
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