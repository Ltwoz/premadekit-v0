"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ModalContextType {
  showModal: (content: ReactNode, title: string, description?: string) => void;
  hideModal: () => void;
}

export const ModalContext = createContext<ModalContextType>({
  showModal: () => {},
  hideModal: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>();
  const [modalDescription, setModalDescription] = useState<string | undefined>();

  const showModal = (content: ReactNode, title: string, description?: string) => {
    setModalContent(content);
    setModalTitle(title);
    setModalDescription(description);
    setIsOpen(true);
  };

  const hideModal = () => {
    setIsOpen(false);
    setModalContent(null);
    setModalTitle(undefined);
    setModalDescription(undefined);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalTitle={modalTitle}
        modalDescription={modalDescription}
        modalContent={modalContent}
      />
    </ModalContext.Provider>
  );
}

function Modal({
  isOpen,
  setIsOpen,
  modalTitle,
  modalDescription,
  modalContent,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  modalTitle: string | undefined;
  modalDescription?: string;
  modalContent: ReactNode;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          {modalTitle && <DialogTitle>{modalTitle}</DialogTitle>}
          {modalDescription && (
            <DialogDescription>{modalDescription}</DialogDescription>
          )}
        </DialogHeader>
        {modalContent}
      </DialogContent>
    </Dialog>
  );
}
