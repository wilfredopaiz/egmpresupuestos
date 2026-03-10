# 007 - Generación de PDF del presupuesto

## Contexto

La página `/presupuesto` ya tiene un botón "Exportar PDF" en el footer, pero es demo — solo muestra un toast. El objetivo es generar un PDF real con el layout del presupuesto, listo para enviar al cliente.

---

## Librería recomendada

**`@react-pdf/renderer`** — genera PDFs en React con componentes declarativos. No requiere backend.

```bash
npm install @react-pdf/renderer (ya ha sido instalado)
```

usar `@react-pdf/renderer` para un resultado profesional y controlable.

---

## 1. Archivos a crear

```
src/components/presupuesto/PresupuestoPDF.tsx    → Componente PDF
src/components/presupuesto/pdf-styles.ts         → Estilos del PDF
```

---

## 2. Archivos a modificar

```
src/pages/Presupuesto.tsx    → Conectar botón "Exportar PDF"
```

---

## 3. Estructura del PDF

El PDF debe contener, en orden:

### Cabecera
- Logo/nombre de la empresa, el logo esta en public/logo.webp
- CIF, dirección, teléfono, email (de `app_settings`)
- Fecha de emisión (hoy)
- Número de presupuesto (por ahora: `PRE-{project.id.slice(0,8).toUpperCase()}`)
- Validez del presupuesto (de `app_settings.defaults.budget_validity_days` días)

### Datos del cliente
- Nombre del cliente (`project.client?.name ?? project.client_name`)

### Datos de la obra
- Nombre del proyecto
- Estado

### Desglose por sección
- Tabla: Sección | Subtotal
- Fila de total antes de ajustes

### Detalle de partidas
- Por cada sección, listar sus partidas:
  - Nombre de la partida
  - Unidad
  - Cantidad
  - Precio unitario
  - Total de la línea

### Resumen económico
- Subtotal
- Margen (si aplica, puede omitirse en la vista cliente)
- IVA (si `include_iva`)
- **TOTAL**

### Pie de página
- Texto legal: "Este presupuesto tiene una validez de X días..."
- Datos de contacto de la empresa

---

## 4. Componente `PresupuestoPDF.tsx`

```tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface PresupuestoPDFProps {
  project: Project;
  appSettings: AppSettings;
  margin: number;
  includeIva: boolean;
  ivaPercentage: number;
}

export function PresupuestoPDF({ project, appSettings, ... }: PresupuestoPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Cabecera */}
        {/* Datos cliente/obra */}
        {/* Detalle partidas */}
        {/* Resumen económico */}
        {/* Pie */}
      </Page>
    </Document>
  );
}
```

---

## 5. Cambios en `Presupuesto.tsx`

Reemplazar el handler demo `handleExport` por:

```tsx
import { pdf } from '@react-pdf/renderer';

const handleExport = async () => {
  const blob = await pdf(
    <PresupuestoPDF
      project={project}
      appSettings={appSettings}
      margin={project.margin_percentage}
      includeIva={project.include_iva}
      ivaPercentage={project.iva_percentage}
    />
  ).toBlob();

  const filename = `Presupuesto_${project.name.replace(/\s+/g, '_')}.pdf`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
```

---

## 6. Dependencias adicionales

```bash
npm install @react-pdf/renderer  # ya instalado
```

---

## 7. Verificación

- [ ] Botón "Exportar PDF" descarga un archivo `.pdf`
- [ ] El PDF contiene nombre de empresa, CIF, dirección, teléfono, email
- [ ] El PDF contiene nombre del cliente y nombre de la obra
- [ ] El PDF lista todas las partidas con cantidad, unidad y precio
- [ ] El PDF muestra subtotal, IVA (si aplica) y total
- [ ] El nombre del archivo es `Presupuesto_{nombre_obra}.pdf`
- [ ] Si `app_settings.company.name` está vacío, muestra placeholder
- [ ] El PDF se ve bien en A4

---

## Notas

- El margen de beneficio **no debe mostrarse** en el PDF al cliente — solo el precio final con margen ya aplicado.
- Los precios del PDF deben venir de `project_items.price_installation` y `project_items.price_supply` (snapshot), no de las plantillas.
- Si en el futuro se quiere vista previa en el navegador, `@react-pdf/renderer` tiene `<PDFViewer>` para embeber el PDF en un `iframe`.
