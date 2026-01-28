import { useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Registro = {
  fecha: string;
  areas: {
    lavado: boolean;
    llenado: boolean;
    equipos: boolean;
    almacen: boolean;
    patio: boolean;
    tanques: boolean;
    oficina: boolean;
    sanitarios: boolean;
  };
  reviso: string;
  observaciones: string;
};

export default function RDLYDDA() {
  // 👇 Recuperamos el nombre desde Home (igual que en RDODP)
  const location = useLocation();
  const nombreUsuario = (location.state as { nombre?: string })?.nombre || "";

  const [registros, setRegistros] = useState<Registro[]>([
    {
      fecha: "",
      areas: {
        lavado: false,
        llenado: false,
        equipos: false,
        almacen: false,
        patio: false,
        tanques: false,
        oficina: false,
        sanitarios: false,
      },
      reviso: nombreUsuario,
      observaciones: "",
    },
  ]);

  // Agregar un nuevo día (máx 12)
  const agregarDia = () => {
    if (registros.length < 12) {
      setRegistros([
        ...registros,
        {
          fecha: "",
          areas: {
            lavado: false,
            llenado: false,
            equipos: false,
            almacen: false,
            patio: false,
            tanques: false,
            oficina: false,
            sanitarios: false,
          },
          reviso: nombreUsuario, // 👈 también aquí
          observaciones: "",
        },
      ]);
    } else {
      alert("Solo se pueden registrar hasta 12 días. (2 semanas)");
    }
  };

  // Manejar cambios en inputs normales
  const handleChange = (index: number, field: keyof Registro, value: string) => {
    const nuevosRegistros = [...registros];
    (nuevosRegistros[index][field] as string) = value;
    setRegistros(nuevosRegistros);
  };

  // Manejar cambios en checkboxes
  const handleCheckboxChange = (
    index: number,
    area: keyof Registro["areas"],
    checked: boolean
  ) => {
    const nuevosRegistros = [...registros];
    nuevosRegistros[index].areas[area] = checked;
    setRegistros(nuevosRegistros);
  };

  // Generar PDF en formato horizontal
  const generarPDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Logo
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
        doc.text("Registro para la Limpieza y Desinfección de Áreas", pageWidth / 2, 40, {
          align: "center",
        });

        autoTable(doc, {
          startY: 50,
          head: [
            [
              "Fecha",
              "Lavado",
              "Llenado",
              "Equipos",
              "Almacén",
              "Patio",
              "Tanques",
              "Oficina",
              "Sanitarios",
              "Revisó",
              "Observaciones",
            ],
          ],
          body: registros.map((r) => [
            r.fecha,
            r.areas.lavado ? "SÍ" : "",
            r.areas.llenado ? "SÍ" : "",
            r.areas.equipos ? "SÍ" : "",
            r.areas.almacen ? "SÍ" : "",
            r.areas.patio ? "SÍ" : "",
            r.areas.tanques ? "SÍ" : "",
            r.areas.oficina ? "SÍ" : "",
            r.areas.sanitarios ? "SÍ" : "",
            nombreUsuario, // 👈 siempre el usuario en el PDF
            r.observaciones,
          ]),
          theme: "grid",
          headStyles: { fillColor: [52, 152, 219], textColor: 255 },
          bodyStyles: { fillColor: [245, 251, 255] },
          styles: { fontSize: 9 },
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
        Registro para la Limpieza y Desinfección de Áreas
      </h2>

      {registros.map((registro, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            padding: "15px",
            marginBottom: "20px",
            backgroundColor: "#73b2e9",
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

          {/* Checkboxes de áreas */}
          <div style={{ textAlign: "left" }}>
            {Object.entries(registro.areas).map(([area, valor]) => (
              <label key={area}>
                <input
                  type="checkbox"
                  checked={valor}
                  onChange={(e) =>
                    handleCheckboxChange(index, area as keyof Registro["areas"], e.target.checked)
                  }
                />{" "}
                {area.charAt(0).toUpperCase() + area.slice(1)}
                <br />
              </label>
            ))}
          </div>

          <input
            type="text"
            placeholder="Revisó"
            value={nombreUsuario}
            readOnly
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              backgroundColor: "#2d3436",
              color:  "#dfe6e9",
              fontWeight: "bold",
            }}
          />

          <input
            type="text"
            placeholder="Observaciones"
            value={registro.observaciones}
            onChange={(e) =>
              handleChange(index, "observaciones", e.target.value)
            }
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
