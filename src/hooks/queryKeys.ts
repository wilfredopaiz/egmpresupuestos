export const queryKeys = {
  projects: {
    all: ["projects"] as const,
    detail: (id: string) => ["projects", id] as const,
  },
  clients: {
    all: ["clients"] as const,
  },
  sections: {
    all: ["sections"] as const,
  },
  templates: {
    all: ["templates"] as const,
    bySection: (sectionId: string) => ["templates", "section", sectionId] as const,
  },
  appSettings: {
    one: ["app-settings"] as const,
  },
};
