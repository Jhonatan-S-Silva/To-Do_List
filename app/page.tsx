"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [tarefa, setTarefa] = useState("");
  const [filtro, setFiltro] = useState("todas");

  const [tarefas, setTarefas] = useState<
    {
      id: number;
      nome: string;
      concluida: boolean;
    }[]
  >([]);

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");

    if (tarefasSalvas) {
      setTarefas(JSON.parse(tarefasSalvas));
    }

    setCarregando(false);
  }, []);

  useEffect(() => {
    if (!carregando) {
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
    }
  }, [tarefas, carregando]);

  function adicionarTarefa(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!tarefa.trim()) {
      return;
    }

    const novaTarefa = {
      id: Date.now(),
      nome: tarefa.trim(),
      concluida: false,
    };

    setTarefas((listaAtual) => [...listaAtual, novaTarefa]);
    setTarefa("");
  }

  function alternarConclusao(id: number) {
    setTarefas((listaAtual) =>
      listaAtual.map((item) =>
        item.id === id ? { ...item, concluida: !item.concluida } : item,
      ),
    );
  }

  function excluirTarefa(id: number) {
    setTarefas((listaAtual) => listaAtual.filter((item) => item.id !== id));
  }

  const tarefasFiltradas = tarefas.filter((item) => {
    if (filtro === "pendentes") {
      return !item.concluida;
    }

    if (filtro === "concluidas") {
      return item.concluida;
    }

    return true;
  });

  const totalTarefas = tarefas.length;
  const tarefasConcluidas = tarefas.filter((item) => item.concluida).length;
  const tarefasPendentes = totalTarefas - tarefasConcluidas;

  // Cálculo da porcentagem para a barra de progresso
  const progresso =
    totalTarefas > 0 ? Math.round((tarefasConcluidas / totalTarefas) * 100) : 0;

  return (
    <main>
      <header>
        <h1>Lista de Afazeres</h1>
        <p>Se organize aqui rapaz</p>
      </header>

      <section>
        <h2>Bora logo Faze isso ai</h2>

        <form onSubmit={adicionarTarefa}>
          <input
            type="text"
            placeholder="Digite uma tarefa..."
            value={tarefa}
            onChange={(e) => setTarefa(e.target.value)}
          />

          <button type="submit">Adicionar tarefa</button>
        </form>

        <div className="contadores">
          <div>
            <span>Total</span>
            <strong>{totalTarefas}</strong>
          </div>

          <div>
            <span>Pendentes</span>
            <strong>{tarefasPendentes}</strong>
          </div>

          <div>
            <span>Concluídas</span>
            <strong>{tarefasConcluidas}</strong>
          </div>
        </div>

        {/* BARRA DE PROGRESSO VISUAL */}
        <div className="container-progresso">
          <div className="info-progresso">
            <span>Progresso da Meta</span>
            <span>{progresso}%</span>
          </div>
          <div className="barra-fundo">
            <div
              className="barra-preenchida"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
        </div>

        <div className="filtros">
          <button
            type="button"
            className={filtro === "todas" ? "ativo" : ""}
            onClick={() => setFiltro("todas")}
          >
            Todas
          </button>

          <button
            type="button"
            className={filtro === "pendentes" ? "ativo" : ""}
            onClick={() => setFiltro("pendentes")}
          >
            Pendentes
          </button>

          <button
            type="button"
            className={filtro === "concluidas" ? "ativo" : ""}
            onClick={() => setFiltro("concluidas")}
          >
            Concluídas
          </button>
        </div>

        <div className="lista-tarefas">
          {tarefasFiltradas.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                marginTop: "20px",
                color: "#85858f",
              }}
            >
              Nenhuma tarefa encontrada.
            </p>
          ) : (
            tarefasFiltradas.map((item) => (
              <article
                key={item.id}
                className={item.concluida ? "concluida" : ""}
              >
                <input
                  type="checkbox"
                  checked={item.concluida}
                  onChange={() => alternarConclusao(item.id)}
                />

                <span>{item.nome}</span>

                <button type="button" onClick={() => excluirTarefa(item.id)}>
                  Excluir
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
