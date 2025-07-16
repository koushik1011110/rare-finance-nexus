
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DetailViewModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export default function DetailViewModal({
  title,
  isOpen,
  onClose,
  children,
  fullScreen = false,
}: DetailViewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={fullScreen ? "max-w-[95vw] w-[95vw] h-[95vh] max-h-[95vh]" : "max-w-3xl"}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className={`py-4 ${fullScreen ? "overflow-y-auto" : ""}`}>{children}</div>
      </DialogContent>
    </Dialog>
  );
}
