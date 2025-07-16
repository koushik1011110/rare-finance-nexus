
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EditModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export default function EditModal({
  title,
  isOpen,
  onClose,
  children,
  fullScreen = false,
}: EditModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={fullScreen ? "max-w-[95vw] max-h-[95vh] w-full" : "max-w-3xl max-h-[80vh]"}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className={fullScreen ? "max-h-[85vh] pr-4" : "max-h-[60vh] pr-4"}>
          <div className="py-4">{children}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
