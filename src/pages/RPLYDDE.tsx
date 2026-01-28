import { useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Registro = {
  fecha: string;
  equipos: {
    tanqueAlmacenamiento: boolean;
    filtroLechoProfundo: boolean;
    filtroCarbonActivado: boolean;
    filtroSuavizador: boolean;
    osmosis: boolean;
    tanqueAguaOsmotica: boolean;
    filtroCarbonBlock: boolean;
    filtroPulidor: boolean;
    lamparaUV1: boolean;
  };
  reviso: string;
  observaciones: string;
};

export default function RPLYDDE() {
  // 👇 Recuperamos el nombre desde Home
  const location = useLocation();
  const nombreUsuario = (location.state as { nombre?: string })?.nombre || "";

  const [registros, setRegistros] = useState<Registro[]>([
    {
      fecha: "",
      equipos: {
        tanqueAlmacenamiento: false,
        filtroLechoProfundo: false,
        filtroCarbonActivado: false,
        filtroSuavizador: false,
        osmosis: false,
        tanqueAguaOsmotica: false,
        filtroCarbonBlock: false,
        filtroPulidor: false,
        lamparaUV1: false,
      },
      reviso: nombreUsuario, // 👈 ya queda fijo con el usuario
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
          equipos: {
            tanqueAlmacenamiento: false,
            filtroLechoProfundo: false,
            filtroCarbonActivado: false,
            filtroSuavizador: false,
            osmosis: false,
            tanqueAguaOsmotica: false,
            filtroCarbonBlock: false,
            filtroPulidor: false,
            lamparaUV1: false,
          },
          reviso: nombreUsuario, // 👈 también aquí
          observaciones: "",
        },
      ]);
    } else {
      alert("Solo se pueden registrar hasta 12 días. (2 semanas)");
    }
  };

  // Manejar cambios en inputs normales (solo observaciones)
  const handleChange = (index: number, field: keyof Registro, value: string) => {
    const nuevosRegistros = [...registros];
    (nuevosRegistros[index][field] as string) = value;
    setRegistros(nuevosRegistros);
  };

  // Manejar cambios en checkboxes
  const handleCheckboxChange = (
    index: number,
    equipo: keyof Registro["equipos"],
    checked: boolean
  ) => {
    const nuevosRegistros = [...registros];
    nuevosRegistros[index].equipos[equipo] = checked;
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

      // Logo comentado - No aparece en el PDF
      /*
      const logo = await fetch("/lafuente.png");
      const logoBlob = await logo.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const imgData = reader.result as string;

        // Dimensiones
        const pageWidth = doc.internal.pageSize.getWidth();
        const logoWidth = 25;
        const logoHeight = 25;
        const xPos = (pageWidth - logoWidth) / 2;

        // Logo
        doc.addImage(imgData, "PNG", xPos, 10, logoWidth, logoHeight);
      */

        // Dimensiones
        const pageWidth = doc.internal.pageSize.getWidth();

        // Título - posición ajustada (de 40 a 20)
        doc.setFontSize(16);
        doc.text(
          "Registro para la Limpieza y Desinfección de Equipos",
          pageWidth / 2,
          20,
          { align: "center" }
        );

        // Tabla - posición ajustada (de 50 a 30)
        autoTable(doc, {
          startY: 30,
          head: [
            [
              "Fecha",
              "Tanque de Almacenamiento A. Clorada",
              "Filtro Lecho Profundo",
              "Filtro Carbón Activado",
              "Filtro Suavizador",
              "Ósmosis Inversa",
              "Tanque Almacenamiento A. Osmótica",
              "Filtro Carbón en Block",
              "Filtro Pulidor",
              "Lámpara U.V.",
              "Revisó",
              "Observaciones",
            ],
          ],
          body: registros.map((r) => [
            r.fecha,
            r.equipos.tanqueAlmacenamiento ? "SÍ" : "",
            r.equipos.filtroLechoProfundo ? "SÍ" : "",
            r.equipos.filtroCarbonActivado ? "SÍ" : "",
            r.equipos.filtroSuavizador ? "SÍ" : "",
            r.equipos.osmosis ? "SÍ" : "",
            r.equipos.tanqueAguaOsmotica ? "SÍ" : "",
            r.equipos.filtroCarbonBlock ? "SÍ" : "",
            r.equipos.filtroPulidor ? "SÍ" : "",
            r.equipos.lamparaUV1 ? "SÍ" : "",
            nombreUsuario, // 👈 siempre el usuario en el PDF
            r.observaciones,
          ]),
          theme: "grid",
          headStyles: { fillColor: [52, 152, 219], textColor: 255 },
          bodyStyles: { fillColor: [245, 251, 255] },
          styles: { fontSize: 9 },
        });

        doc.save("reporte.pdf");
      //};

      //reader.readAsDataURL(logoBlob);
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
      {/* Logo comentado - No aparece en la interfaz */}
      {/*
      <img
        src="/lafuente.png"
        alt="Logo Purificadora"
        style={{
          maxWidth: "120px",
          height: "auto",
          marginBottom: "15px",
        }}
      />
      */}

      <h2 style={{ color: "#1c3853", marginBottom: "20px" }}>
        Registro para la Limpieza y Desinfección de Equipos
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

          {/* Checkboxes de equipos con nombres formateados */}
          <div style={{ textAlign: "left" }}>
            {[
              { key: "tanqueAlmacenamiento", label: "Tanque de Almacenamiento A. Clorada" },
              { key: "filtroLechoProfundo", label: "Filtro Lecho Profundo" },
              { key: "filtroCarbonActivado", label: "Filtro Carbón Activado" },
              { key: "filtroSuavizador", label: "Filtro Suavizador" },
              { key: "osmosis", label: "Ósmosis Inversa" },
              { key: "tanqueAguaOsmotica", label: "Tanque Almacenamiento A. Osmótica" },
              { key: "filtroCarbonBlock", label: "Filtro Carbón en Block" },
              { key: "filtroPulidor", label: "Filtro Pulidor" },
              { key: "lamparaUV1", label: "Lámpara U.V." },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: "block", marginBottom: "5px" }}>
                <input
                  type="checkbox"
                  checked={registro.equipos[key as keyof Registro["equipos"]]}
                  onChange={(e) =>
                    handleCheckboxChange(
                      index,
                      key as keyof Registro["equipos"],
                      e.target.checked
                    )
                  }
                  style={{ marginRight: "8px" }}
                />
                {label}
              </label>
            ))}
          </div>

          <input
            type="text"
            placeholder="Revisó"
            value={nombreUsuario} // 👈 siempre el usuario logueado
            readOnly
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              backgroundColor: "#2d3436",
              color: "#dfe6e9",
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