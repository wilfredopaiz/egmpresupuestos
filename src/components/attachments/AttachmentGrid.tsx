import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AttachmentLightbox } from "./AttachmentLightbox";
import { getSignedUrl } from "@/services/attachments.service";
import type { ProjectAttachment } from "@/types";

interface AttachmentGridProps {
  attachments: ProjectAttachment[];
  readOnly?: boolean;
  onDelete?: (attachment: ProjectAttachment) => void;
}

export function AttachmentGrid({ attachments, readOnly = false, onDelete }: AttachmentGridProps) {
  const [itemsWithUrl, setItemsWithUrl] = useState<ProjectAttachment[]>([]);
  const [loadingUrls, setLoadingUrls] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadUrls = async () => {
      setLoadingUrls(true);
      try {
        const mapped = await Promise.all(
          attachments.map(async (attachment) => {
            try {
              const signedUrl = await getSignedUrl(attachment.storage_path, 60 * 60 * 24);
              return { ...attachment, signed_url: signedUrl };
            } catch {
              return { ...attachment, signed_url: undefined };
            }
          }),
        );

        if (!cancelled) setItemsWithUrl(mapped);
      } finally {
        if (!cancelled) setLoadingUrls(false);
      }
    };

    void loadUrls();

    return () => {
      cancelled = true;
    };
  }, [attachments]);

  const visibleItems = useMemo(
    () => itemsWithUrl.filter((item) => typeof item.signed_url === "string" && item.signed_url.length > 0),
    [itemsWithUrl],
  );

  if (attachments.length === 0) {
    return <p className="text-sm text-muted-foreground">No hay imagenes adjuntas.</p>;
  }

  if (loadingUrls) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {Array.from({ length: Math.min(attachments.length, 6) }).map((_, idx) => (
          <Skeleton key={idx} className="aspect-[4/3] rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
        {visibleItems.map((attachment, index) => (
          <div key={attachment.id} className="relative group rounded-lg overflow-hidden border">
            {attachment.signed_url ? (
              <img
                src={attachment.signed_url}
                alt={attachment.filename}
                className="w-full aspect-[4/3] object-cover cursor-pointer"
                onClick={() => {
                  setCurrentIndex(index);
                  setLightboxOpen(true);
                }}
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-muted flex items-center justify-center text-xs text-muted-foreground p-2 text-center">
                No disponible
              </div>
            )}

            {!readOnly && onDelete && (
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete(attachment)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <AttachmentLightbox
        open={lightboxOpen}
        attachments={visibleItems}
        currentIndex={currentIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setCurrentIndex((prev) => (prev - 1 + visibleItems.length) % visibleItems.length)}
        onNext={() => setCurrentIndex((prev) => (prev + 1) % visibleItems.length)}
      />
    </>
  );
}
