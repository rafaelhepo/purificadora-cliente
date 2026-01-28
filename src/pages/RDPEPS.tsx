import { useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Registro = {
  fecha: string;
  cantidadProducida: string;
  fechaDeVenta: string;
  lote: string;
  cantidadVendida: string;
  reviso: string;
};

export default function RDPEPS() {

  console.log('Carga con exito');
  const location = useLocation();
  const nombreUsuario = (location.state as { nombre?: string })?.nombre || "";

  const [registros, setRegistros] = useState<Registro[]>([
    {
      fecha: "",
      cantidadProducida: "",
      fechaDeVenta: "",
      lote: "",
      cantidadVendida: "",
      reviso: "",
    },
  ]);


  const agregarDia = () => {
    if (registros.length < 12) {
      setRegistros([
        ...registros,
        {
          fecha: "",
          cantidadProducida: "",
          fechaDeVenta: "",
          lote: "",
          cantidadVendida: "",
          reviso: "",
        },
      ]);
    } else {
      alert("Solo se pueden registrar hasta 12 días. (2 semanas)");
    }
  };


  const handleChange = (index: number, field: keyof Registro, value: string) => {
    const nuevosRegistros = [...registros];
    nuevosRegistros[index][field] = value;
    setRegistros(nuevosRegistros);
  };


  const generarPDF = async () => {
    try {
      const doc = new jsPDF();

      // Logo comentado - No aparece en el PDF
      /*
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
      */

        const pageWidth = doc.internal.pageSize.getWidth();

        // Título - posición ajustada (de 40 a 20)
        doc.setFontSize(16);
        doc.text(
          "Registro de Primeras Entradas Primeras Salidas",
          pageWidth / 2,
          20,
          { align: "center" }
        );


        // Tabla con todos los registros - posición ajustada (de 50 a 30)
        autoTable(doc, {
          startY: 30,
          head: [["Fecha", "Cantidad Producida", "Fecha de Venta", "Lote", "Cantidad Vendida", "Revisó"]],
          body: registros.map((r) => [
            r.fecha,
            r.cantidadProducida,
            r.fechaDeVenta,
            r.lote,
            r.cantidadVendida,
            nombreUsuario,
          ]),
          theme: "grid",
          headStyles: { fillColor: [52, 152, 219], textColor: 255 },
          bodyStyles: { fillColor: [245, 251, 255] },
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
        Registro de Primeras Entradas Primeras Salidas
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
            type="number"
            placeholder="Cantidad Producida"
            value={registro.cantidadProducida}
            onChange={(e) => handleChange(index, "cantidadProducida", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="date"
            value={registro.fechaDeVenta}
            onChange={(e) => handleChange(index, "fechaDeVenta", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="number"
            placeholder="Lote"
            value={registro.lote}
            onChange={(e) => handleChange(index, "lote", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

          <input
            type="number"
            placeholder="Cantidad Vendida"
            value={registro.cantidadVendida}
            onChange={(e) => handleChange(index, "cantidadVendida", e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #2980b9",
              outline: "none",
            }}
          />

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
              color: "#dfe6e9",
              fontWeight: "bold",
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