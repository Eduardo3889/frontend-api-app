import { Inbox } from "lucide-react";

export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center">
      <Inbox className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
      <h3 className="mt-3 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}
