import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-ocean">404</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Pagina nao encontrada</h1>
        <p className="mt-2 text-sm text-slate-600">A rota acessada nao existe nesta aplicacao.</p>
        <Link className="btn-primary mt-5" to="/dashboard">
          Voltar ao painel
        </Link>
      </div>
    </main>
  );
}
