import { useState, useEffect, useCallback } from "react";
import { Project, mockProjects } from "@/data/mockData";
import {
  initializeProjects,
  getProjects,
  getProjectById,
  addProject,
  updateProject,
  subscribe,
} from "@/data/projectsStore";

let initialized = false;

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => {
    if (!initialized) {
      initializeProjects(mockProjects);
      initialized = true;
    }
    return getProjects();
  });

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setProjects(getProjects());
    });
    return unsubscribe;
  }, []);

  return { projects };
}

export function useProject(id: string | null) {
  const [project, setProject] = useState<Project | undefined>(() => {
    if (!initialized) {
      initializeProjects(mockProjects);
      initialized = true;
    }
    return id ? getProjectById(id) : undefined;
  });

  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setProject(id ? getProjectById(id) : undefined);
    });
    return unsubscribe;
  }, [id]);

  return { project };
}

export function useProjectActions() {
  const createProject = useCallback(
    (data: { name: string; client: string; notes?: string }) => {
      return addProject({
        name: data.name,
        client: data.client,
        status: "en-medicion",
        notes: data.notes,
        items: [],
      });
    },
    []
  );

  const updateProjectData = useCallback(
    (id: string, updates: Partial<Project>) => {
      return updateProject(id, updates);
    },
    []
  );

  return { createProject, updateProject: updateProjectData };
}
