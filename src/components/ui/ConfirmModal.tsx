"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle } from "lucide-react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  supplierName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  supplierName,
  confirmLabel = "Excluir fornecedor",
  cancelLabel = "Cancelar",
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex items-start space-x-3.5">
        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {message}
          </p>
          {supplierName && (
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-medium text-slate-900">
              {supplierName}
            </div>
          )}
          <p className="text-[11px] font-medium text-rose-600">
            Esta operação não poderá ser desfeita.
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-end space-x-2.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
