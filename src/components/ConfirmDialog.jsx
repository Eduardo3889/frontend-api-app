import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ description, loading, onCancel, onConfirm, open, title }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4 py-6">
      <div className="w-full max-w-md rounded-md bg-white p-5 shadow-panel">
        <div className="flex gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red-50 text-ember">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ink">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button className="btn-secondary" type="button" onClick={onCancel} disabled={loading}>
            Cancelar
          </button>
          <button className="btn-danger" type="button" onClick={onConfirm} disabled={loading}>
            Remover
          </button>
        </div>
      </div>
    </div>
  );
}
