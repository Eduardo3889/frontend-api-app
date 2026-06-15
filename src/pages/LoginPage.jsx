import { LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/ToastProvider.jsx";

export default function LoginPage() {
  const { authenticated, login } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (authenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(form);
      showToast({ message: "Login realizado com sucesso." });
      navigate(from, { replace: true });
    } catch (error) {
      showToast({ type: "error", message: error.message || "Falha ao autenticar." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_460px]">
      <section className="hidden items-center justify-center bg-ink px-10 text-white lg:flex">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-200">Projeto integrado</p>
          <h1 className="mt-4 text-4xl font-bold">Controle completo da API em uma interface web responsiva.</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Acesse rotas protegidas com JWT, gerencie usuarios e mantenha os itens sincronizados com o backend.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-md rounded-md border border-slate-200 bg-white p-6 shadow-panel">
          <div className="mb-6">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-md bg-blue-50 text-ocean">
              <LockKeyhole className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-ink">Entrar</h2>
            <p className="mt-1 text-sm text-slate-600">Informe suas credenciais para acessar o painel.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="field-label">Email</span>
              <input
                className="field-input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </label>
            <label className="block">
              <span className="field-label">Senha</span>
              <input
                className="field-input"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </label>
            <button className="btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "Autenticando..." : "Acessar painel"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
