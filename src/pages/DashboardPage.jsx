import { Box, ShieldCheck, Users } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const cards = [
  {
    title: "Autenticacao",
    description: "JWT armazenado localmente e enviado em rotas protegidas.",
    icon: ShieldCheck
  },
  {
    title: "Usuarios",
    description: "Listagem, cadastro, edicao e remocao conforme permissoes da API.",
    icon: Users
  },
  {
    title: "Itens",
    description: "CRUD completo para os recursos de itens disponibilizados pelo backend.",
    icon: Box
  }
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Bem-vindo${user?.name || user?.nome ? `, ${user.name || user.nome}` : ""}. Use o menu para acessar os recursos do sistema.`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <section key={card.title} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 grid h-10 w-10 place-items-center rounded-md bg-blue-50 text-ocean">
              <card.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <h3 className="text-base font-bold text-ink">{card.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
