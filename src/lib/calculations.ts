type TemplateLike = {
  price_installation: number;
  price_supply: number | null;
  section?: { id: string; name?: string | null; icon?: string | null } | null;
};

type ProjectItemLike = {
  quantity: number;
  include_installation: boolean;
  include_supply: boolean;
  template: TemplateLike | null;
};

type ProjectLike = {
  items: ProjectItemLike[] | null;
};

export function calculateItemTotal(item: ProjectItemLike): number {
  if (!item.template) return 0;

  let total = 0;
  if (item.include_installation) {
    total += item.template.price_installation * item.quantity;
  }
  if (item.include_supply && item.template.price_supply) {
    total += item.template.price_supply * item.quantity;
  }
  return total;
}

export function calculateProjectTotal(project: ProjectLike): number {
  const items = project.items ?? [];
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}

export function calculateProjectTotalBySection(project: ProjectLike): Record<string, number> {
  const totals: Record<string, number> = {};
  const items = project.items ?? [];

  items.forEach((item) => {
    const sectionId = item.template?.section?.id;
    if (!sectionId) return;
    totals[sectionId] = (totals[sectionId] || 0) + calculateItemTotal(item);
  });

  return totals;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatQuantity(quantity: number, unit: string): string {
  return `${quantity.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
}
