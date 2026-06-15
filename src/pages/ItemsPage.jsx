import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import PageHeader from "../components/PageHeader.jsx";
import ResourceModal from "../components/ResourceModal.jsx";
import ResourceTable from "../components/ResourceTable.jsx";
import { useToast } from "../components/ToastProvider.jsx";
import { itemService } from "../services/itemService.js";

const emptyForm = {
  name: "",
  description: "",
  quantity: "0",
  price: "0"
};

const getId = (item) => item.id || item._id;
const money = (value) => {
  const numericValue = Number(value || 0);
  return numericValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export default function ItemsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const columns = useMemo(
    () => [
      { key: "name", label: "Nome", render: (item) => item.name || item.nome || "-" },
      { key: "description", label: "Descricao", render: (item) => item.description || item.descricao || "-" },
      { key: "quantity", label: "Quantidade", render: (item) => item.quantity ?? item.quantidade ?? "-" },
      { key: "price", label: "Preco", render: (item) => money(item.price ?? item.preco) }
    ],
    []
  );

  const loadItems = async () => {
    setLoading(true);
    try {
      setItems(await itemService.list());
    } catch (error) {
      showToast({ type: "error", message: error.message || "Erro ao carregar itens." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name || item.nome || "",
      description: item.description || item.descricao || "",
      quantity: String(item.quantity ?? item.quantidade ?? 0),
      price: String(item.price ?? item.preco ?? 0)
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
      description: form.description,
      descricao: form.description,
      quantity: Number(form.quantity),
      quantidade: Number(form.quantity),
      price: Number(form.price),
      preco: Number(form.price)
    };

    try {
      if (editing) {
        await itemService.update(getId(editing), payload);
        showToast({ message: "Item atualizado com sucesso." });
      } else {
        await itemService.create(payload);
        showToast({ message: "Item cadastrado com sucesso." });
      }
      setModalOpen(false);
      await loadItems();
    } catch (error) {
      showToast({ type: "error", message: error.message || "Erro ao salvar item." });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);

    try {
      await itemService.remove(getId(deleteTarget));
      showToast({ message: "Item removido com sucesso." });
      setDeleteTarget(null);
      await loadItems();
    } catch (error) {
      showToast({ type: "error", message: error.message || "Erro ao remover item." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Itens"
        description="Cadastre, atualize e remova os itens consumindo diretamente as rotas protegidas da API."
        action={
          <button className="btn-primary" type="button" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Novo item
          </button>
        }
      />

      <ResourceTable
        columns={columns}
        data={items}
        emptyDescription="Cadastre o primeiro item ou verifique se a API retornou dados para este recurso."
        emptyTitle="Nenhum item encontrado"
        loading={loading}
        onDelete={setDeleteTarget}
        onEdit={openEdit}
      />

      <ResourceModal open={modalOpen} title={editing ? "Editar item" : "Cadastrar item"} onClose={() => setModalOpen(false)}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="field-label">Nome</span>
            <input className="field-input" name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label className="block">
            <span className="field-label">Descricao</span>
            <textarea className="field-input min-h-24 resize-y" name="description" value={form.description} onChange={handleChange} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Quantidade</span>
              <input
                className="field-input"
                type="number"
                min="0"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />
            </label>
            <label className="block">
              <span className="field-label">Preco</span>
              <input
                className="field-input"
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
              />
            </label>
          </div>
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
        title="Remover item"
        description={`Confirma a remocao de ${deleteTarget?.name || deleteTarget?.nome || "este item"}?`}
        loading={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
