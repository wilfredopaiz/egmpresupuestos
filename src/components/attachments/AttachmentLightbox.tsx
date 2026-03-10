import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectAttachment } from "@/types";

interface AttachmentLightboxProps {
  open: boolean;
  attachments: ProjectAttachment[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function AttachmentLightbox({
  open,
  attachments,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: AttachmentLightboxProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, onPrev, onNext]);

  if (!open || attachments.length === 0) return null;

  const current = attachments[currentIndex];
  if (!current?.signed_url) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4" onClick={onClose}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/10 hover:text-white"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {attachments.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            <ChevronLeft className="h-7 w-7" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <ChevronRight className="h-7 w-7" />
          </Button>
        </>
      )}

      <div className="max-w-6xl max-h-[88vh] w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <img
          src={current.signed_url}
          alt={current.filename}
          className="max-h-[80vh] max-w-full object-contain rounded-lg"
        />
        <div className="mt-3 text-center text-white/90 text-sm">
          <p className="font-medium">{current.filename}</p>
          <p className="text-white/70">{new Date(current.created_at).toLocaleString("es-ES")}</p>
        </div>
      </div>
    </div>
  );
}