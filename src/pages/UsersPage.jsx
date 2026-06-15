import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import PageHeader from "../components/PageHeader.jsx";
import ResourceModal from "../components/ResourceModal.jsx";
import ResourceTable from "../components/ResourceTable.jsx";
import { useToast } from "../components/ToastProvider.jsx";
import { userService } from "../services/userService.js";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  role: "user"
};

const getId = (item) => item.id || item._id;

export default function UsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const columns = useMemo(
    () => [
      { key: "name", label: "Nome", render: (item) => item.name || item.nome || "-" },
      { key: "email", label: "Email" },
      { key: "role", label: "Perfil", render: (item) => item.role || item.perfil || "-" }
    ],
    []
  );

  const loadUsers = async () => {
    setLoading(true);
    try {
      setUsers(await userService.list());
    } catch (error) {
      showToast({ type: "error", message: error.message || "Erro ao carregar usuarios." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      name: user.name || user.nome || "",
      email: user.email || "",
      password: "",
      role: user.role || user.perfil || "user"
    });
    setModalOpen(true);
  };

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      nome: form.name,
      email: form.email,
      role: form.role,
      perfil: form.role,
      ...(form.password ? { password: form.password, senha: form.password } : {})
    };

    try {
      if (editing) {
        await userService.update(getId(editing), payload);
        showToast({ message: "Usuario atualizado com sucesso." });
      } else {
        await userService.create(payload);
        showToast({ message: "Usuario cadastrado com sucesso." });
      }
      setModalOpen(false);
      await loadUsers();
    } catch (error) {
      showToast({ type: "error", message: error.message || "Erro ao salvar usuario." });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);

    try {
      await userService.remove(getId(deleteTarget));
      showToast({ message: "Usuario removido com sucesso." });
      setDeleteTarget(null);
      await loadUsers();
    } catch (error) {
      showToast({ type: "error", message: error.message || "Erro ao remover usuario." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Usuarios"
        description="Gerencie os usuarios da API respeitando as regras de permissao do backend."
        action={
          <button className="btn-primary" type="button" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Novo usuario
          </button>
        }
      />

      <ResourceTable
        columns={columns}
        data={users}
        emptyDescription="Cadastre o primeiro usuario ou verifique se seu perfil tem permissao para listar este recurso."
        emptyTitle="Nenhum usuario encontrado"
        loading={loading}
        onDelete={setDeleteTarget}
        onEdit={openEdit}
      />

      <ResourceModal
        open={modalOpen}
        title={editing ? "Editar usuario" : "Cadastrar usuario"}
        onClose={() => setModalOpen(false)}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="field-label">Nome</span>
            <input className="field-input" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label className="block">
            <span className="field-label">Email</span>
            <input className="field-input" type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label className="block">
            <span className="field-label">Senha</span>
            <input
              className="field-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required={!editing}
            />
          </label>
          <label className="block">
            <span className="field-label">Perfil</span>
            <select className="field-input" name="role" value={form.role} onChange={handleChange}>
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </label>
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button className="btn-secondary" type="button" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancelar
            </button>
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </ResourceModal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Remover usuario"
        description={`Confirma a remocao de ${deleteTarget?.name || deleteTarget?.nome || deleteTarget?.email || "este usuario"}?`}
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
