import { Edit3, Trash2 } from "lucide-react";
import EmptyState from "./EmptyState.jsx";
import Spinner from "./Spinner.jsx";

const readValue = (item, key) => item?.[key] ?? item?.[key.toLowerCase()] ?? "-";

export default function ResourceTable({ columns, data, emptyDescription, emptyTitle, loading, onDelete, onEdit }) {
  if (loading) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-8">
        <Spinner label="Carregando registros" />
      </div>
    );
  }

  if (!data.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-bold uppercase text-slate-500">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, index) => (
              <tr key={item.id || item._id || index} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                    {column.render ? column.render(item) : readValue(item, column.key)}
                  </td>
                ))}
                <td className="whitespace-nowrap px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
                      type="button"
                      onClick={() => onEdit(item)}
                      aria-label="Editar"
                      title="Editar"
                    >
                      <Edit3 className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      className="rounded-md border border-red-200 p-2 text-ember hover:bg-red-50"
                      type="button"
                      onClick={() => onDelete(item)}
                      aria-label="Remover"
                      title="Remover"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
