import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles as styles } from "./pdf-styles";

type CompanySettings = {
  name?: string;
  cif?: string;
  address?: string;
  phone?: string;
  email?: string;
};

type AppSettingsLike = {
  settings?: {
    company?: CompanySettings;
    defaults?: {
      budget_validity_days?: number;
    };
  };
};

interface PresupuestoPDFProps {
  project: any;
  appSettings?: AppSettingsLike | null;
  subtotal: number;
  subtotalWithMargin: number;
  marginPercentage: number;
  includeIva: boolean;
  ivaPercentage: number;
  ivaAmount: number;
  total: number;
  logoUrl?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function PresupuestoPDF({
  project,
  appSettings,
  subtotal,
  subtotalWithMargin,
  marginPercentage,
  includeIva,
  ivaPercentage,
  ivaAmount,
  total,
  logoUrl,
}: PresupuestoPDFProps) {
  const company = appSettings?.settings?.company ?? {};
  const validityDays = appSettings?.settings?.defaults?.budget_validity_days ?? 30;
  const issueDate = new Date();
  const budgetNumber = `PRE-${String(project.id ?? "").slice(0, 8).toUpperCase()}`;
  const clientName = project.client?.name ?? project.client_name ?? "Cliente no especificado";
  const clientEmail = project.client?.email ?? null;
  const clientPhone = project.client?.phone ?? null;

  const items = project.items ?? [];
  const itemsBySection = items.reduce((acc: Record<string, any[]>, item: any) => {
    const sectionName = item.template?.section?.name ?? "Sin seccion";
    if (!acc[sectionName]) acc[sectionName] = [];
    acc[sectionName].push(item);
    return acc;
  }, {});

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.section, styles.row]}>
          <View style={[styles.col, { flex: 1 }]}> 
            <Text style={styles.companyName}>{company.name || "Empresa"}</Text>
            <Text style={styles.muted}>CIF: {company.cif || "-"}</Text>
            <Text style={styles.muted}>{company.address || "Direccion no configurada"}</Text>
            <Text style={styles.muted}>Tel: {company.phone || "-"}</Text>
            <Text style={styles.muted}>Email: {company.email || "-"}</Text>
          </View>
          {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : null}
        </View>

        <View style={[styles.section, styles.box]}>
          <View style={styles.infoGrid}>
            <View style={styles.infoCol}>
              <Text style={styles.h1}>Presupuesto</Text>
              <Text style={styles.budgetNumber}>Nro: {budgetNumber}</Text>
              <Text>Fecha emision: {formatDate(issueDate)}</Text>
              <Text style={styles.muted}>Validez: {validityDays} dias</Text>
            </View>
            <View style={styles.infoCol}>
              <Text style={styles.h2}>Cliente</Text>
              <Text>{clientName}</Text>
              {clientEmail ? <Text style={styles.muted}>Email: {clientEmail}</Text> : null}
              {clientPhone ? <Text style={styles.muted}>Telefono: {clientPhone}</Text> : null}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.c1}>Partida</Text>
            <Text style={styles.c2}>Cant.</Text>
            <Text style={styles.c3}>P. unit.</Text>
            <Text style={styles.c4}>Total</Text>
          </View>

          {Object.entries(itemsBySection).map(([sectionName, sectionItems]) => (
            <View key={sectionName}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeaderText}>{sectionName}</Text>
              </View>
              {(sectionItems as any[]).map((item) => {
                const baseUnitPrice =
                  (item.include_installation ? item.price_installation : 0) +
                  (item.include_supply ? item.price_supply ?? 0 : 0);
                const unitPrice = baseUnitPrice * (1 + marginPercentage / 100);
                const lineTotal = unitPrice * item.quantity;
                return (
                  <View key={item.id} style={styles.tableRow}>
                    <Text style={styles.c1}>{item.template?.name} ({item.template?.unit})</Text>
                    <Text style={styles.c2}>{Number(item.quantity).toFixed(2)}</Text>
                    <Text style={styles.c3}>{formatCurrency(unitPrice)}</Text>
                    <Text style={styles.c4}>{formatCurrency(lineTotal)}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>{formatCurrency(subtotalWithMargin)}</Text>
          </View>
          {includeIva && (
            <View style={styles.summaryRow}>
              <Text>IVA ({ivaPercentage}%)</Text>
              <Text>{formatCurrency(ivaAmount)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text>TOTAL</Text>
            <Text>{formatCurrency(total)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Este presupuesto tiene una validez de {validityDays} dias desde la fecha de emision.</Text>
          <Text>
            {company.name || "Empresa"} | {company.phone || "-"} | {company.email || "-"}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
