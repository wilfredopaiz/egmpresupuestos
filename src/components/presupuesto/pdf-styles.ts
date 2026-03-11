import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Helvetica",
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  col: {
    flexDirection: "column",
  },
  h1: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 10,
  },
  h2: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
  },
  muted: {
    color: "#6b7280",
  },
  companyName: {
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 2,
  },
  logo: {
    width: 150,
    height: 60,
    objectFit: "contain",
  },
  box: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 12,
  },
  infoCol: {
    flex: 1,
  },
  budgetNumber: {
    fontSize: 10,
    fontWeight: 700,
    color: "#374151",
    marginBottom: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  sectionHeaderRow: {
    backgroundColor: "#FFF4E6",
    borderBottomWidth: 1,
    borderBottomColor: "#FFF4E6",
    paddingTop: 3,
    paddingHorizontal: 8,
    marginTop: 0,
  },
  sectionHeaderText: {
    fontWeight: 700
  },
  c1: { width: "45%" },
  c2: { width: "12%", textAlign: "right" },
  c3: { width: "18%", textAlign: "right" },
  c4: { width: "25%", textAlign: "right" },
  cSection: { width: "70%" },
  cTotal: { width: "30%", textAlign: "right" },
  summaryBox: {
    marginTop: 8,
    marginLeft: "auto",
    width: 220,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 10,
    gap: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    marginTop: 6,
    paddingTop: 6,
    fontSize: 12,
    fontWeight: 700,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginVertical: 10,
  },
  footer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    fontSize: 9,
    color: "#6b7280",
    gap: 2,
  },
});
