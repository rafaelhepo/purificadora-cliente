import { useState } from "react";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable, { type RowInput } from "jspdf-autotable";

type Registro = {
  semana: string;
  areas: {
    barrer: boolean[];
    trapear: boolean[];
    lavarBanquetas: boolean[];
    lijarTarja: boolean[];
    maquinaVending: boolean[];
    limpiarTinacos: boolean[];
    lavarBotesBasura: boolean[];
    lavarCajasTapas: boolean[];
    tuberia: boolean[];
    limpiezaAnaquel: boolean[];
  };
  //reviso: string;
  actividad: string;
};

const DIAS = ["L", "M", "M", "J", "V", "S", "D"];

const AREAS_LIST = [
  { key: "barrer", label: "Barrer" },
  { key: "trapear", label: "Trapear" },
  { key: "lavarBanquetas", label: "Lavar Banquetas" },
  { key: "lijarTarja", label: "Lijar Tarja" },
  { key: "maquinaVending", label: "Maquina Vending" },
  { key: "limpiarTinacos", label: "Limpiar Tinacos" },
  { key: "lavarBotesBasura", label: "Lavar Botes de Basura" },
  { key: "lavarCajasTapas", label: "Lavar Cajas de Tapas" },
  { key: "tuberia", label: "Tuberia" },
  { key: "limpiezaAnaquel", label: "Limpieza de Anaquel" },
] as const;

export default function BDL() {
  const location = useLocation();
  const nombreUsuario = (location.state as { nombre?: string })?.nombre || "";

  const crearDiasVacios = () => [false, false, false, false, false, false, false];

  const [registros, setRegistros] = useState<Registro[]>([
    {
      semana: "1",
      areas: {
        barrer: crearDiasVacios(),
        trapear: crearDiasVacios(),
        lavarBanquetas: crearDiasVacios(),
        lijarTarja: crearDiasVacios(),
        maquinaVending: crearDiasVacios(),
        limpiarTinacos: crearDiasVacios(),
        lavarBotesBasura: crearDiasVacios(),
        lavarCajasTapas: crearDiasVacios(),
        tuberia: crearDiasVacios(),
        limpiezaAnaquel: crearDiasVacios(),
      },
      //reviso: nombreUsuario,
      actividad: "",
    },
  ]);

  const agregarSemana = () => {
    if (registros.length < 4) {
      setRegistros([
        ...registros,
        {
          semana: `${registros.length + 1}`,
          areas: {
            barrer: crearDiasVacios(),
            trapear: crearDiasVacios(),
            lavarBanquetas: crearDiasVacios(),
            lijarTarja: crearDiasVacios(),
            maquinaVending: crearDiasVacios(),
            limpiarTinacos: crearDiasVacios(),
            lavarBotesBasura: crearDiasVacios(),
            lavarCajasTapas: crearDiasVacios(),
            tuberia: crearDiasVacios(),
            limpiezaAnaquel: crearDiasVacios(),
          },
         // reviso: nombreUsuario,
          actividad: "",
        },
      ]);
    } else {
      alert("Solo se pueden registrar hasta 4 semanas.");
    }
  };

  const handleCheckboxChange = (
    index: number,
    area: keyof Registro["areas"],
    diaIndex: number,
    checked: boolean
  ) => {
    const nuevosRegistros = [...registros];
    nuevosRegistros[index].areas[area][diaIndex] = checked;
    setRegistros(nuevosRegistros);
  };

  const handleChange = (index: number, field: keyof Registro, value: string) => {
    const nuevosRegistros = [...registros];
    (nuevosRegistros[index][field] as string) = value;
    setRegistros(nuevosRegistros);
  };

  const generarPDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      doc.setFillColor(26, 60, 101);
      doc.rect(0, 0, 297, 20, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("BITÁCORA DE LIMPIEZA", 148.5, 13, { align: "center" });

      const body: (string | number)[][] = AREAS_LIST.map(({ key, label }) => {
        const rowData: (string | number)[] = [label];
        registros.forEach((reg) => {
          rowData.push(...reg.areas[key].map((c) => (c ? "X" : "")));
        });
        return rowData;
      });

      // ✅ CAMBIO CLAVE: Usamos unknown y luego RowInput para evitar el error de 'any'
      const headRows = [
        [
          {
            content: "NO. DE SEMANA",
            colSpan: 1,
            styles: { fillColor: [26, 60, 101], textColor: 255, fontStyle: "bold", halign: "center" as const },
          },
          ...registros.map((_, i) => ({
            content: `SEMANA ${i + 1}`,
            colSpan: 7,
            styles: { fillColor: [26, 60, 101], textColor: 255, fontStyle: "bold", halign: "center" as const },
          })),
        ],
        ["ACTIVIDAD", ...registros.flatMap(() => DIAS)],
      ] as unknown as RowInput[];

      autoTable(doc, {
        startY: 25,
        head: headRows,
        body: body,
        theme: "grid",
        headStyles: {
          fillColor: [26, 60, 101],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
          fontSize: 10,
        },
        styles: { lineColor: [0, 0, 0], lineWidth: 0.1, cellPadding: 1.5 },
        columnStyles: { 0: { cellWidth: 40, fontStyle: "bold", halign: "left" } },
      });

      doc.save("bitacora_limpieza.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "30px", fontFamily: "Arial", backgroundColor: "#eef2f6", minHeight: "100vh" }}>
      <h2 style={{ color: "#1c3853", marginBottom: "20px" }}>Bitácora de Limpieza de Áreas</h2>

      {registros.map((registro, index) => (
        <div key={index} style={{
          display: "flex", flexDirection: "column", gap: "12px", padding: "15px",
          marginBottom: "20px", backgroundColor: "#73b2e9", borderRadius: "12px",
          maxWidth: "650px", margin: "0 auto", boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
        }}>
          <input
            type="text"
            placeholder="Bitácora de Limpieza"
            value={registro.semana}
            onChange={(e) => handleChange(index, "semana", e.target.value)}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #2980b9", textAlign: "center", fontWeight: "bold" }}
          />

          <div style={{ textAlign: "left" }}>
            <strong style={{ display: "block", marginBottom: "10px", color: "#1c3853" }}>Registro de Actividades:</strong>
            {AREAS_LIST.map(({ key, label }) => (
              <div key={key} style={{ marginBottom: "12px", padding: "10px", backgroundColor: "rgba(255,255,255,0.4)", borderRadius: "8px" }}>
                <strong style={{ display: "block", marginBottom: "6px", color: "#1c3853" }}>{label}:</strong>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {DIAS.map((dia, diaIndex) => (
                    <label key={diaIndex} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={registro.areas[key][diaIndex]}
                        onChange={(e) => handleCheckboxChange(index, key, diaIndex, e.target.checked)}
                      />
                      <span>{dia}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <input type="text" value={nombreUsuario} readOnly style={{ padding: "10px", borderRadius: "8px", backgroundColor: "#2d3436", color: "#dfe6e9", fontWeight: "bold" }} />

          <input
            type="text"
            placeholder="Actividad"
            value={registro.actividad}
            onChange={(e) => handleChange(index, "actividad", e.target.value)}
            style={{ padding: "10px", borderRadius: "8px", border: "1px solid #2980b9" }}
          />
        </div>
      ))}

      <div style={{ marginTop: "20px" }}>
        <button onClick={agregarSemana} style={{ padding: "10px 20px", backgroundColor: "#3498db", color: "white", borderRadius: "8px", marginRight: "10px", cursor: "pointer", fontWeight: "bold", border: "none" }}>
          Agregar Semana
        </button>
        <button onClick={generarPDF} style={{ padding: "10px 20px", backgroundColor: "#27ae60", color: "white", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", border: "none" }}>
          Generar PDF
        </button>
      </div>
    </div>
  );
}