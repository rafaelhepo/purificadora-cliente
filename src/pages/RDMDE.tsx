import { useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Tipos de equipos predefinidos
type EquipoPredefinido =
  | "zeolita"
  | "carbonActivado"
  | "plata"
  | "filtroPulidor"
  | "ozono"
  | "lamparaUV1"
  | "lamparaUV2"
  | "ozonoAmbiental"
  | "lamparaVerificadora";

// Tipo para observaciones personalizadas por equipo
type EquipoRegistro = {
  nombre: string;
  observacionPredefinida: string;
  observacionPersonalizada: string;
};

// Tipo principal del registro diario
type Registro = {
  fecha: string;
  equipos: Record<EquipoPredefinido, boolean>;
  equiposPersonalizados: EquipoRegistro[];
  equipoExtra: string;
  observacionExtra: string;
  reviso: string;
};

// Tipo para filas del PDF (type-safe)
type FilaPDF = [string, string, string, string]; // [Fecha, Equipo, Observaciones, Revisó]

// Textos predefinidos por equipo
const observacionesPredefinidas: Record<EquipoPredefinido, string> = {
  zeolita: "Retrolavado al lecho profundo",
  carbonActivado: "Retrolavado al carbón activado",
  plata: "Lavado manual a las barras de plata",
  filtroPulidor: "Lavado manual y desinfección del cartucho y filtro",
  ozono: "Revisión de sistema de ozono",
  lamparaUV1: "Limpieza y verificación de lámpara UV1",
  lamparaUV2: "Limpieza y verificación de lámpara UV2",
  ozonoAmbiental: "Generación de ozono ambiental",
  lamparaVerificadora: "Prueba con lámpara verificadora",
};

// Nombres amigables para mostrar
const nombresAmigables: Record<EquipoPredefinido, string> = {
  zeolita: "Zeolita",
  carbonActivado: "Carbón Activado",
  plata: "Plata",
  filtroPulidor: "Filtro Pulidor",
  ozono: "Ozono",
  lamparaUV1: "Lámpara UV1",
  lamparaUV2: "Lámpara UV2",
  ozonoAmbiental: "Ozono Ambiental",
  lamparaVerificadora: "Lámpara Verificadora",
};

export default function RDMDE() {
  const location = useLocation();
  const nombreUsuario = (location.state as { nombre?: string })?.nombre || "";

  const [registros, setRegistros] = useState<Registro[]>([
    {
      fecha: "",
      equipos: {
        zeolita: false,
        carbonActivado: false,
        plata: false,
        filtroPulidor: false,
        ozono: false,
        lamparaUV1: false,
        lamparaUV2: false,
        ozonoAmbiental: false,
        lamparaVerificadora: false,
      },
      equiposPersonalizados: [],
      equipoExtra: "",
      observacionExtra: "",
      reviso: nombreUsuario,
    },
  ]);

  const agregarDia = () => {
    if (registros.length < 12) {
      setRegistros([
        ...registros,
        {
          fecha: "",
          equipos: {
            zeolita: false,
            carbonActivado: false,
            plata: false,
            filtroPulidor: false,
            ozono: false,
            lamparaUV1: false,
            lamparaUV2: false,
            ozonoAmbiental: false,
            lamparaVerificadora: false,
          },
          equiposPersonalizados: [],
          equipoExtra: "",
          observacionExtra: "",
          reviso: nombreUsuario,
        },
      ]);
    } else {
      alert("Solo se pueden registrar hasta 12 días. (2 semanas)");
    }
  };

  // ✅ handleChange type-safe con generics
  const handleChange = <K extends keyof Registro>(
    index: number,
    field: K,
    value: Registro[K]
  ) => {
    const nuevosRegistros = [...registros];
    nuevosRegistros[index][field] = value;
    setRegistros(nuevosRegistros);
  };

  const handleCheckboxChange = (
    index: number,
    equipo: EquipoPredefinido,
    checked: boolean
  ) => {
    const nuevosRegistros = [...registros];
    const reg = nuevosRegistros[index];

    reg.equipos[equipo] = checked;

    // Reconstruir lista de equipos seleccionados con observaciones
    const lista = Object.keys(reg.equipos)
      .filter((key) => reg.equipos[key as EquipoPredefinido])
      .map((key) => {
        const equipoKey = key as EquipoPredefinido;
        const existente = reg.equiposPersonalizados.find((e) => e.nombre === nombresAmigables[equipoKey]);
        return {
          nombre: nombresAmigables[equipoKey],
          observacionPredefinida: observacionesPredefinidas[equipoKey],
          observacionPersonalizada: existente?.observacionPersonalizada || "",
        };
      });

    reg.equiposPersonalizados = lista;
    setRegistros(nuevosRegistros);
  };

  const handleObservacionPersonalizada = (
    index: number,
    nombreEquipo: string,
    value: string
  ) => {
    const nuevosRegistros = [...registros];
    const equipo = nuevosRegistros[index].equiposPersonalizados.find((e) => e.nombre === nombreEquipo);
    if (equipo) {
      equipo.observacionPersonalizada = value;
    }
    setRegistros(nuevosRegistros);
  };

  const generarPDF = async () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

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
        doc.text("Registro de Mantenimiento de Equipo", pageWidth / 2, 40, {
          align: "center",
        });

        // ✅ filas: type-safe con FilaPDF[]
        const filas: FilaPDF[] = [];

        registros.forEach((r) => {
          // Equipos predefinidos seleccionados
          r.equiposPersonalizados.forEach((eq) => {
            const obs = [
              eq.observacionPredefinida,
              eq.observacionPersonalizada,
            ]
              .filter(Boolean)
              .join(" | ");
            filas.push([r.fecha, eq.nombre, obs, r.reviso]);
          });

          // Equipo extra (manual)
          if (r.equipoExtra.trim()) {
            const obsExtra = r.observacionExtra.trim() || "Sin observaciones";
            filas.push([r.fecha, r.equipoExtra, obsExtra, r.reviso]);
          }
        });

        autoTable(doc, {
          startY: 50,
          head: [["Fecha", "Equipo", "Observaciones", "Revisó"]],
          body: filas,
          theme: "grid",
          headStyles: { fillColor: [52, 152, 219], textColor: 255 },
          bodyStyles: { fillColor: [245, 251, 255] },
          styles: { fontSize: 9 },
        });

        doc.save("limpieza_equipos_detallado.pdf");
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
        Registro de Mantenimiento de Equipo
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
            maxWidth: "700px",
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

          <div style={{ textAlign: "left", fontSize: "14px" }}>
            <strong>Equipos limpiados:</strong>
            <br />
            {Object.keys(registro.equipos).map((eq) => {
              const equipo = eq as EquipoPredefinido;
              return (
                <div key={equipo} style={{ margin: "8px 0" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={registro.equipos[equipo]}
                      onChange={(e) =>
                        handleCheckboxChange(index, equipo, e.target.checked)
                      }
                    />{" "}
                    {nombresAmigables[equipo]}
                  </label>
                  {registro.equipos[equipo] && (
                    <div style={{ marginLeft: "20px", fontSize: "13px" }}>
                      <em>{observacionesPredefinidas[equipo]}</em>
                      <br />
                      <input
                        type="text"
                        placeholder="Observación adicional (opcional)"
                        value={
                          registro.equiposPersonalizados.find((e) => e.nombre === nombresAmigables[equipo])
                            ?.observacionPersonalizada || ""
                        }
                        onChange={(e) =>
                          handleObservacionPersonalizada(index, nombresAmigables[equipo], e.target.value)
                        }
                        style={{
                          width: "90%",
                          padding: "6px",
                          marginTop: "4px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Equipo adicional */}
          <div style={{ marginTop: "15px", textAlign: "left" }}>
            <input
              type="text"
              placeholder="Otro equipo (opcional)"
              value={registro.equipoExtra}
              onChange={(e) => handleChange(index, "equipoExtra", e.target.value)}
              style={{
                padding: "8px",
                width: "100%",
                borderRadius: "4px",
                border: "1px solid #2980b9",
              }}
            />
            <textarea
              placeholder="Observación para equipo adicional"
              value={registro.observacionExtra}
              onChange={(e) => handleChange(index, "observacionExtra", e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #2980b9",
                marginTop: "5px",
                minHeight: "40px",
              }}
            />
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