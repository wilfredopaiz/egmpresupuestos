import { useMemo, useState } from "react";
import type { ChangeEventHandler, DragEventHandler } from "react";
import { Upload, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUploadAttachment } from "@/hooks/useAttachments";
import { toast } from "@/hooks/use-toast";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

interface AttachmentUploaderProps {
  projectId: string;
}

export function AttachmentUploader({ projectId }: AttachmentUploaderProps) {
  const uploadAttachment = useUploadAttachment();
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const accept = useMemo(() => "image/jpeg,image/png,image/webp,image/gif", []);

  const validateFiles = (files: File[]) => {
    const invalid = files.filter((f) => !f.type.startsWith("image/") || f.size > MAX_FILE_SIZE_BYTES);

    invalid.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Archivo invalido",
          description: `${file.name} no es una imagen`,
          variant: "destructive",
        });
      } else if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
          title: "Archivo demasiado grande",
          description: `${file.name} supera 10 MB`,
          variant: "destructive",
        });
      }
    });

    return files.filter((f) => f.type.startsWith("image/") && f.size <= MAX_FILE_SIZE_BYTES);
  };

  const uploadFiles = async (files: File[]) => {
    const validFiles = validateFiles(files);
    if (validFiles.length === 0) return;

    try {
      setIsUploading(true);
      setProgress(0);

      for (let i = 0; i < validFiles.length; i += 1) {
        await uploadAttachment.mutateAsync({ projectId, file: validFiles[i] });
        setProgress(Math.round(((i + 1) / validFiles.length) * 100));
      }

      toast({
        title: "Adjuntos subidos",
        description: `${validFiles.length} archivo(s) subido(s) correctamente`,
      });
    } catch {
      toast({
        title: "Error",
        description: "No se pudieron subir todos los archivos",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const onInputChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const selected = Array.from(event.target.files ?? []);
    await uploadFiles(selected);
    event.target.value = "";
  };

  const onDrop: DragEventHandler<HTMLDivElement> = async (event) => {
    event.preventDefault();
    setIsDragOver(false);
    const dropped = Array.from(event.dataTransfer.files ?? []);
    await uploadFiles(dropped);
  };

  return (
    <div className="space-y-3">
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
          isDragOver ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
      >
        <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground mb-3">
          Arrastra imagenes aqui o selecciona archivos (JPG, PNG, WEBP, GIF, max 10 MB)
        </p>
        <Button asChild variant="outline" size="sm" disabled={isUploading}>
          <label className="cursor-pointer">
            <Upload className="h-4 w-4" />
            Seleccionar imagenes
            <input type="file" accept={accept} multiple className="hidden" onChange={onInputChange} />
          </label>
        </Button>
      </div>

      {isUploading && (
        <div className="space-y-1">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">Subiendo... {progress}%</p>
        </div>
      )}
    </div>
  );
}
