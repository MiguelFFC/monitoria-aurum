import React, { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// ============================================================
//  CONFIGURAÇÃO — cole aqui os dois valores do seu projeto Supabase.
//  Você encontra em: Supabase > Project Settings > Data API / API Keys
//  - SUPABASE_URL:  algo como https://xxxxxxxx.supabase.co
//  - SUPABASE_ANON_KEY:  a chave "anon public" (longa, começa com "eyJ...")
//  Esta chave pode ficar no código do site — ela é pública por design.
// ============================================================
const SUPABASE_URL = "https://tmzofzsmqptvawghovlk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PJpXOW4xI0Gl9Ylq9WmefQ_H0KG66ol";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------------------------------------------------------------------------
// Estrutura do checklist, extraída do documento de fases do Aurum.
// ---------------------------------------------------------------------------
const FASES = [
  {
    id: "f0",
    titulo: "Fase 0 — Chegada do aluno novo",
    quando: "Assim que o aluno entra no Modo Modelo do Aurum",
    tarefas: [
      { id: "f0-t1", texto: "Identificar o aluno como novo, iniciar o acompanhamento e criar a pasta compartilhada", link: "https://drive.google.com/drive/folders/1BBCkZZC5SdfQXu3-fALg1-ShXNUTQTQr?usp=sharing" },
      { id: "f0-t2", texto: "Mapear em qual fase da jornada o aluno está (palestra ou Palestra ATM) antes de qualquer contato" },
      { id: "f0-t3", texto: "Agendar e confirmar a 1ª reunião com a coordenação do Aurum (entender o sistema)" },
      { id: "f0-t4", texto: "Agendar e confirmar a 2ª reunião com o ferramenteiro (primeira etapa)", link: "https://docs.google.com/document/d/1o7Z4L_CjCAtKpXLJTyHsU-VWybAMFEHNEcARQfhK-2M/edit?tab=t.0" },
      { id: "f0-t5", texto: "Solicitar ao aluno uma foto institucional para o site", link: "https://drive.google.com/drive/folders/15guJI39D-Ozk4IZvA1SCk0pXPgSnJrSi?usp=sharing" },
      { id: "f0-t6", texto: "Solicitar a gravação dos 2 vídeos da carta de venda (prazo 7 dias); se precisar de edição, seguir o protocolo", link: "https://docs.google.com/spreadsheets/d/1AdHXZhFCV01GX69ZJg6qqQzYbfLhQddEgDo3fyBAX9k/edit?usp=sharing" },
      { id: "f0-t7", texto: "Com o vídeo pronto, enviar o documento para o webdesigner", link: "https://docs.google.com/document/d/1HHorp6ufte6b3OAfzxC4uPMvZu1kU4eJ/edit?usp=sharing&ouid=108163080390072071680&rtpof=true&sd=true" },
      { id: "f0-t8", texto: "Agendar e confirmar a 3ª reunião com tráfego", link: "https://docs.google.com/document/d/1_vVmmem9aUFuGuBdsna4inn3X_4OQ6YO2rAuTExPp-E/edit?tab=t.0" },
    ],
  },
  {
    id: "f1",
    titulo: "Fase 1 — Configuração técnica",
    quando: "Builderall, API e Facebook",
    tarefas: [
      { id: "f1-t1", texto: "Agendar e confirmar a 4ª reunião com o ferramenteiro sobre API", link: "https://docs.google.com/document/d/1o7Z4L_CjCAtKpXLJTyHsU-VWybAMFEHNEcARQfhK-2M/edit?tab=t.pab13t56jn5k" },
    ],
  },
  {
    id: "f2",
    titulo: "Fase 2 — Conteúdo e formação",
    quando: "",
    tarefas: [
      { id: "f2-t1", texto: "Verificar se o aluno está produzindo o conteúdo do guia", link: "https://docs.google.com/spreadsheets/d/1rJKtX7Z7ZwrgkTXHFiMF1jk60rLRmm5gWpaDPAy747A/edit?usp=sharing" },
      { id: "f2-t2", texto: "Acompanhar se o aluno está executando a produção de conteúdo (não só planejando)" },
      { id: "f2-t3", texto: "Verificar se o aluno está acompanhando as aulas" },
    ],
  },
  {
    id: "f3",
    titulo: "Fase 3 — Palestras do ciclo",
    quando: "",
    tarefas: [
      { id: "f3-t1", texto: "Verificar se o aluno vai realizar palestra(s) do ciclo" },
      { id: "f3-t2", texto: "Confirmar se já existe data marcada para a palestra" },
      { id: "f3-t3", texto: "Confirmar o valor do investimento da palestra" },
    ],
  },
  {
    id: "f4",
    titulo: "Fase 4 — Captação",
    quando: "Tráfego e lives",
    tarefas: [
      { id: "f4-t1", texto: "Acompanhar a campanha do aluno pela planilha de dados de tráfego (preenchida pelo gestor/técnico)" },
      { id: "f4-t2", texto: "Enviar ao aluno os exemplos de lives de aquecimento" },
      { id: "f4-t3", texto: "Verificar se o aluno já definiu as datas das lives de aquecimento" },
      { id: "f4-t4", texto: "Verificar se o aluno precisa de ajuda para programar as lives; se sim, agendar reunião com o ferramenteiro" },
      { id: "f4-t5", texto: "Coletar todos os links relacionados (lives, formulários etc.)" },
      { id: "f4-t6", texto: "Com campanha ativa, agendar reunião de acompanhamento a cada 7 dias enquanto ela rodar" },
    ],
  },
  {
    id: "f5",
    titulo: "Fase 5 — Comunicação e página",
    quando: "",
    tarefas: [
      { id: "f5-t1", texto: "Verificar se o aluno já tem a planilha de envio de mensagens (grupos e e-mails)" },
      { id: "f5-t2", texto: "Verificar se a configuração da página do aluno foi feita" },
    ],
  },
];

const TOTAL_TAREFAS = FASES.reduce((n, f) => n + f.tarefas.length, 0);

const C = {
  bg: "#0f1720", panel: "#161f2b", panel2: "#1d2836", line: "#2a3746",
  ink: "#eef2f6", sub: "#93a2b3", gold: "#d8a534", goldSoft: "#3a3016",
  green: "#4ea87a", greenSoft: "#183028",
};

export default function App() {
  const [alunos, setAlunos] = useState([]);
  const [selId, setSelId] = useState(null);
  const [progresso, setProgresso] = useState({}); // { alunoId: Set(tarefaId) }
  const [busca, setBusca] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [faseAberta, setFaseAberta] = useState(FASES[0].id);
  const [mostrarDocumentos, setMostrarDocumentos] = useState(false);
  const [documentos, setDocumentos] = useState([]);
  const [novoDocNome, setNovoDocNome] = useState("");
  const [novoDocLink, setNovoDocLink] = useState("");
  const importRef = useRef(null);

  // ---- Carga inicial + tempo real ----
  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const { data: als, error: e1 } = await supabase.from("alunos").select("*").order("nome");
        if (e1) throw e1;
        const { data: prog, error: e2 } = await supabase.from("progresso").select("*");
        if (e2) throw e2;
        const { data: docs, error: e3 } = await supabase.from("documentos").select("*").order("criado_em");
        if (e3) throw e3;
        if (!ativo) return;
        setAlunos(als || []);
        const mapa = {};
        (prog || []).forEach((r) => {
          (mapa[r.aluno_id] ??= new Set()).add(r.tarefa_id);
        });
        setProgresso(mapa);
        setDocumentos(docs || []);
      } catch (err) {
        setErro(traduzErro(err));
      } finally {
        if (ativo) setCarregando(false);
      }
    })();

    // Escuta mudanças ao vivo (feitas pelos outros monitores)
    const canal = supabase
      .channel("aurum-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "alunos" }, recarregarAlunos)
      .on("postgres_changes", { event: "*", schema: "public", table: "progresso" }, aplicarProgresso)
      .on("postgres_changes", { event: "*", schema: "public", table: "documentos" }, recarregarDocumentos)
      .subscribe();

    return () => { ativo = false; supabase.removeChannel(canal); };
    // eslint-disable-next-line
  }, []);

  async function recarregarAlunos() {
    const { data } = await supabase.from("alunos").select("*").order("nome");
    setAlunos(data || []);
  }

  async function recarregarDocumentos() {
    const { data } = await supabase.from("documentos").select("*").order("criado_em");
    setDocumentos(data || []);
  }

  function aplicarProgresso(payload) {
    setProgresso((prev) => {
      const novo = { ...prev };
      const row = payload.new?.aluno_id ? payload.new : payload.old;
      if (!row) return prev;
      const set = new Set(novo[row.aluno_id] || []);
      if (payload.eventType === "DELETE") set.delete(payload.old.tarefa_id);
      else set.add(payload.new.tarefa_id);
      novo[row.aluno_id] = set;
      return novo;
    });
  }

  const addAluno = async () => {
    const nome = novoNome.trim();
    if (!nome) return;
    setNovoNome("");
    const { data, error } = await supabase.from("alunos").insert({ nome }).select().single();
    if (error) return setErro(traduzErro(error));
    setAlunos((a) => [...a, data].sort((x, y) => x.nome.localeCompare(y.nome, "pt")));
    setSelId(data.id);
  };

  const removerAluno = async (id) => {
    const { error } = await supabase.from("alunos").delete().eq("id", id);
    if (error) return setErro(traduzErro(error));
    setAlunos((a) => a.filter((x) => x.id !== id));
    if (selId === id) setSelId(null);
  };

  const toggle = async (tarefaId) => {
    if (!selId) return;
    const set = new Set(progresso[selId] || []);
    const jaFeita = set.has(tarefaId);
    // Atualização otimista (muda a tela na hora)
    if (jaFeita) set.delete(tarefaId); else set.add(tarefaId);
    setProgresso((p) => ({ ...p, [selId]: set }));
    if (jaFeita) {
      await supabase.from("progresso").delete().eq("aluno_id", selId).eq("tarefa_id", tarefaId);
    } else {
      await supabase.from("progresso").upsert({ aluno_id: selId, tarefa_id: tarefaId, feita: true });
    }
  };

  const importarNomes = async (texto) => {
    const nomes = texto.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    if (!nomes.length) return;
    const { data, error } = await supabase.from("alunos").insert(nomes.map((nome) => ({ nome }))).select();
    if (error) return setErro(traduzErro(error));
    setAlunos((a) => [...a, ...data].sort((x, y) => x.nome.localeCompare(y.nome, "pt")));
  };

  const contarFeitas = (id) => (progresso[id]?.size) || 0;

  const addDocumento = async () => {
    const nome = novoDocNome.trim();
    const link = novoDocLink.trim();
    if (!nome || !link) return;
    if (!/^https?:\/\//i.test(link)) {
      setErro("O link do documento precisa começar com http:// ou https://");
      return;
    }
    setNovoDocNome("");
    setNovoDocLink("");
    const { data, error } = await supabase.from("documentos").insert({ nome, link }).select().single();
    if (error) return setErro(traduzErro(error));
    setDocumentos((d) => [...d, data]);
  };

  const removerDocumento = async (id) => {
    const { error } = await supabase.from("documentos").delete().eq("id", id);
    if (error) return setErro(traduzErro(error));
    setDocumentos((d) => d.filter((x) => x.id !== id));
  };

  // A fase "atual" de um aluno é a primeira fase que ele ainda não completou.
  // Se completou todas, ele está em "concluído".
  const faseAtualDoAluno = (alunoId) => {
    for (const fase of FASES) {
      const feitas = fase.tarefas.filter((t) => progresso[alunoId]?.has(t.id)).length;
      if (feitas < fase.tarefas.length) return fase.id;
    }
    return "concluido";
  };

  const distribuicao = useMemo(() => {
    const contagem = {};
    FASES.forEach((f) => { contagem[f.id] = 0; });
    contagem.concluido = 0;
    alunos.forEach((a) => {
      const fase = faseAtualDoAluno(a.id);
      contagem[fase] = (contagem[fase] || 0) + 1;
    });
    return contagem;
    // eslint-disable-next-line
  }, [alunos, progresso]);

  const mediaGeral = useMemo(() => {
    if (!alunos.length || !TOTAL_TAREFAS) return 0;
    const soma = alunos.reduce((acc, a) => acc + contarFeitas(a.id), 0);
    return Math.round((soma / (alunos.length * TOTAL_TAREFAS)) * 100);
    // eslint-disable-next-line
  }, [alunos, progresso]);

  const alunosFiltrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return q ? alunos.filter((a) => a.nome.toLowerCase().includes(q)) : alunos;
  }, [alunos, busca]);

  const selecionado = alunos.find((a) => a.id === selId);
  const feitasSel = contarFeitas(selId);
  const pctSel = TOTAL_TAREFAS ? Math.round((feitasSel / TOTAL_TAREFAS) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        input, textarea { font-family: inherit; }
        .aurum-scroll::-webkit-scrollbar { width: 8px; }
        .aurum-scroll::-webkit-scrollbar-thumb { background: ${C.line}; border-radius: 8px; }
        .row-al:hover { background: ${C.panel2}; }
        .lnk { color: ${C.gold}; text-decoration: none; }
        .lnk:hover { text-decoration: underline; }
      `}</style>

      {erro && (
        <div style={{ background: "#3a1c1c", color: "#f0c0c0", padding: "10px 20px", fontSize: 13, borderBottom: "1px solid #5a2b2b" }}>
          {erro}
        </div>
      )}

      <header style={{ borderBottom: `1px solid ${C.line}`, padding: "20px 28px", display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: `linear-gradient(140deg, ${C.gold}, #a97c1e)`, display: "grid", placeItems: "center", color: "#231a05", fontWeight: 800, fontSize: 18 }}>A</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>Monitoria Aurum</div>
            <div style={{ fontSize: 12.5, color: C.sub }}>Compartilhado · {alunos.length} aluno{alunos.length === 1 ? "" : "s"} · atualiza ao vivo</div>
          </div>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "calc(100vh - 76px)" }}>
        <aside style={{ borderRight: `1px solid ${C.line}`, background: C.panel, display: "flex", flexDirection: "column", maxHeight: "calc(100vh - 76px)" }}>
          <div style={{ padding: "16px 16px 10px" }}>
            <button
              onClick={() => { setMostrarDocumentos(false); setSelId(null); }}
              style={{
                width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 8, marginBottom: 6,
                border: `1px solid ${!mostrarDocumentos && !selId ? C.gold : C.line}`,
                background: !mostrarDocumentos && !selId ? C.goldSoft : "transparent",
                color: !mostrarDocumentos && !selId ? C.gold : C.sub,
                fontSize: 13.5, fontWeight: 600,
              }}
            >
              📊 Visão geral
            </button>
            <button
              onClick={() => setMostrarDocumentos(true)}
              style={{
                width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 8, marginBottom: 10,
                border: `1px solid ${mostrarDocumentos ? C.gold : C.line}`,
                background: mostrarDocumentos ? C.goldSoft : "transparent",
                color: mostrarDocumentos ? C.gold : C.sub,
                fontSize: 13.5, fontWeight: 600,
              }}
            >
              📄 Documentos
            </button>
            <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar aluno…" style={inp} />
          </div>
          <div className="aurum-scroll" style={{ overflowY: "auto", flex: 1, padding: "0 8px" }}>
            {carregando && <p style={{ color: C.sub, padding: 16, fontSize: 13 }}>Carregando…</p>}
            {!carregando && alunos.length === 0 && (
              <p style={{ color: C.sub, padding: "8px 12px", fontSize: 13, lineHeight: 1.5 }}>
                Nenhum aluno ainda. Adicione abaixo ou cole sua lista de nomes.
              </p>
            )}
            {alunosFiltrados.map((a) => {
              const pct = Math.round((contarFeitas(a.id) / TOTAL_TAREFAS) * 100);
              const ativo = !mostrarDocumentos && a.id === selId;
              return (
                <div key={a.id} className="row-al" onClick={() => { setMostrarDocumentos(false); setSelId(a.id); }}
                  style={{ padding: "10px 12px", borderRadius: 8, marginBottom: 3, cursor: "pointer", background: ativo ? C.panel2 : "transparent", borderLeft: `3px solid ${ativo ? C.gold : "transparent"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: ativo ? 600 : 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.nome}</span>
                    <span style={{ fontSize: 11, color: pct === 100 ? C.green : C.sub, fontWeight: 600, flexShrink: 0 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 3, background: C.line, borderRadius: 3, marginTop: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? C.green : C.gold, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ borderTop: `1px solid ${C.line}`, padding: 12 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addAluno()} placeholder="Nome do aluno" style={{ ...inp, flex: 1 }} />
              <button onClick={addAluno} style={btnGold}>Adicionar</button>
            </div>
            <button onClick={() => importRef.current?.showModal()} style={{ ...btnGhost, width: "100%", marginTop: 8 }}>Importar lista de nomes</button>
          </div>
        </aside>

        <main className="aurum-scroll" style={{ overflowY: "auto", maxHeight: "calc(100vh - 76px)", padding: "24px 28px 60px" }}>
          {mostrarDocumentos && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>Documentos</h2>
                <p style={{ margin: "4px 0 0", color: C.sub, fontSize: 13.5 }}>
                  {documentos.length} documento{documentos.length === 1 ? "" : "s"} de referência, iguais para todos os alunos
                </p>
              </div>

              <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: C.panel, overflow: "hidden", marginBottom: 16 }}>
                {documentos.length === 0 && (
                  <p style={{ padding: 20, color: C.sub, fontSize: 13.5 }}>Nenhum documento ainda. Adicione um abaixo.</p>
                )}
                {documentos.map((doc) => (
                  <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "14px 18px", borderBottom: `1px solid ${C.panel2}`, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14.5, fontWeight: 500 }}>{doc.nome}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
                      <a href={doc.link} target="_blank" rel="noopener noreferrer" className="lnk" style={{ fontSize: 13.5, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 6 }}>
                        👉 Clique aqui para acessar
                      </a>
                      <button onClick={() => removerDocumento(doc.id)} style={{ background: "transparent", border: "none", color: C.sub, fontSize: 12 }}>remover</button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: C.panel, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: C.sub }}>Adicionar documento</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input value={novoDocNome} onChange={(e) => setNovoDocNome(e.target.value)} placeholder="Nome ou função do documento" style={{ ...inp, flex: "1 1 220px" }} />
                  <input value={novoDocLink} onChange={(e) => setNovoDocLink(e.target.value)} placeholder="https://…" style={{ ...inp, flex: "1 1 220px" }} />
                  <button onClick={addDocumento} style={btnGold}>Adicionar</button>
                </div>
              </div>
            </div>
          )}

          {!mostrarDocumentos && !selecionado && (
            <div>
              <div style={{ marginBottom: 22 }}>
                <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>Visão geral</h2>
                <p style={{ margin: "4px 0 0", color: C.sub, fontSize: 13.5 }}>
                  {alunos.length} aluno{alunos.length === 1 ? "" : "s"}
                  {alunos.length > 0 && <> · {mediaGeral}% de progresso médio</>}
                </p>
              </div>

              {alunos.length === 0 ? (
                <p style={{ color: C.sub, fontSize: 13.5 }}>Adicione alunos na barra lateral para ver as estatísticas aqui.</p>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 8 }}>
                    {FASES.map((fase) => {
                      const [rotulo, descricao] = fase.titulo.split(" — ");
                      const qtd = distribuicao[fase.id] || 0;
                      const pct = alunos.length ? Math.round((qtd / alunos.length) * 100) : 0;
                      return (
                        <div key={fase.id} style={{ border: `1px solid ${C.line}`, borderRadius: 12, background: C.panel, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                          <div>
                            <div style={{ fontSize: 11.5, color: C.sub, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>{rotulo}</div>
                            {descricao && <div style={{ fontSize: 12, color: C.sub, marginTop: 1 }}>{descricao}</div>}
                          </div>
                          <div style={{ fontSize: 28, fontWeight: 700, color: C.gold }}>{pct}%</div>
                          <div style={{ fontSize: 12, color: C.sub }}>{qtd} aluno{qtd === 1 ? "" : "s"} parado{qtd === 1 ? "" : "s"} aqui</div>
                          <div style={{ height: 5, background: C.panel2, borderRadius: 5, overflow: "hidden", marginTop: 2 }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: C.gold, borderRadius: 5 }} />
                          </div>
                        </div>
                      );
                    })}

                    {(() => {
                      const qtd = distribuicao.concluido || 0;
                      const pct = alunos.length ? Math.round((qtd / alunos.length) * 100) : 0;
                      return (
                        <div style={{ border: `1px solid #2f5c46`, borderRadius: 12, background: C.greenSoft, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                          <div>
                            <div style={{ fontSize: 11.5, color: C.green, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>Concluído</div>
                            <div style={{ fontSize: 12, color: C.green, marginTop: 1, opacity: 0.85 }}>Todas as fases completas</div>
                          </div>
                          <div style={{ fontSize: 28, fontWeight: 700, color: C.green }}>{pct}%</div>
                          <div style={{ fontSize: 12, color: C.green, opacity: 0.85 }}>{qtd} aluno{qtd === 1 ? "" : "s"} finalizado{qtd === 1 ? "" : "s"}</div>
                          <div style={{ height: 5, background: "#0f2019", borderRadius: 5, overflow: "hidden", marginTop: 2 }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: C.green, borderRadius: 5 }} />
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <p style={{ color: C.sub, fontSize: 12.5, marginTop: 18 }}>Selecione um aluno à esquerda para ver o checklist individual dele.</p>
                </>
              )}
            </div>
          )}
          {!mostrarDocumentos && selecionado && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>{selecionado.nome}</h2>
                  <p style={{ margin: "4px 0 0", color: C.sub, fontSize: 13.5 }}>{feitasSel} de {TOTAL_TAREFAS} tarefas concluídas</p>
                </div>
                <button onClick={() => removerAluno(selecionado.id)} style={btnGhostDanger}>Remover aluno</button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0 26px" }}>
                <div style={{ flex: 1, height: 10, background: C.panel2, borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pctSel}%`, background: pctSel === 100 ? C.green : `linear-gradient(90deg, ${C.gold}, #e6bd5c)`, borderRadius: 10, transition: "width .25s ease" }} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: pctSel === 100 ? C.green : C.gold, minWidth: 48, textAlign: "right" }}>{pctSel}%</span>
              </div>

              {FASES.map((fase) => {
                const feitasFase = fase.tarefas.filter((t) => progresso[selId]?.has(t.id)).length;
                const aberta = faseAberta === fase.id;
                const completa = feitasFase === fase.tarefas.length;
                return (
                  <section key={fase.id} style={{ border: `1px solid ${C.line}`, borderRadius: 12, marginBottom: 14, overflow: "hidden", background: C.panel }}>
                    <button onClick={() => setFaseAberta(aberta ? null : fase.id)} style={{ width: "100%", background: "transparent", border: "none", color: C.ink, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}>
                      <div>
                        <div style={{ fontSize: 15.5, fontWeight: 600 }}>{fase.titulo}</div>
                        {fase.quando && <div style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>{fase.quando}</div>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 20, background: completa ? C.greenSoft : C.goldSoft, color: completa ? C.green : C.gold }}>{feitasFase}/{fase.tarefas.length}</span>
                        <span style={{ color: C.sub, transform: aberta ? "rotate(90deg)" : "none", transition: "transform .15s", fontSize: 13 }}>▶</span>
                      </div>
                    </button>
                    {aberta && (
                      <div style={{ borderTop: `1px solid ${C.line}` }}>
                        {fase.tarefas.map((t) => {
                          const feita = !!progresso[selId]?.has(t.id);
                          return (
                            <div key={t.id} style={{ display: "flex", gap: 12, padding: "13px 18px", borderBottom: `1px solid ${C.panel2}`, alignItems: "flex-start" }}>
                              <button onClick={() => toggle(t.id)} aria-label={feita ? "Desmarcar" : "Marcar como feita"}
                                style={{ flexShrink: 0, width: 22, height: 22, borderRadius: 6, marginTop: 1, border: `2px solid ${feita ? C.green : C.line}`, background: feita ? C.green : "transparent", color: "#0f1720", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 900 }}>
                                {feita ? "✓" : ""}
                              </button>
                              <div style={{ flex: 1 }}>
                                <span style={{ fontSize: 14, lineHeight: 1.5, color: feita ? C.sub : C.ink, textDecoration: feita ? "line-through" : "none" }}>{t.texto}</span>
                                {t.link && <a href={t.link} target="_blank" rel="noopener noreferrer" className="lnk" style={{ display: "inline-block", marginLeft: 6, fontSize: 13 }}>👉 abrir link</a>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
            </>
          )}
        </main>
      </div>

      <dialog ref={importRef} style={dialogStyle}>
        <h3 style={{ margin: "0 0 6px", fontSize: 18 }}>Importar lista de nomes</h3>
        <p style={{ margin: "0 0 12px", color: C.sub, fontSize: 13 }}>Cole um nome por linha. Cada linha vira um aluno.</p>
        <textarea id="import-ta" className="aurum-scroll" style={{ ...inp, width: "100%", height: 200, resize: "vertical" }} placeholder={"Maria Silva\nJoão Souza\nAna Oliveira"} />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
          <button onClick={() => importRef.current?.close()} style={btnGhost}>Cancelar</button>
          <button onClick={async () => { const ta = document.getElementById("import-ta"); await importarNomes(ta.value); ta.value = ""; importRef.current?.close(); }} style={btnGold}>Importar</button>
        </div>
      </dialog>
    </div>
  );
}

function traduzErro(err) {
  const m = err?.message || String(err);
  if (m.includes("Failed to fetch") || m.includes("Invalid API key"))
    return "Não consegui conectar ao Supabase. Confira se a URL e a chave anon foram coladas corretamente no topo do arquivo.";
  return "Erro: " + m;
}

const inp = { background: "#0f1720", border: "1px solid #2a3746", color: "#eef2f6", padding: "9px 11px", borderRadius: 8, fontSize: 13.5, outline: "none", width: "100%" };
const btnGold = { background: "#d8a534", color: "#231a05", border: "none", padding: "9px 14px", borderRadius: 8, fontWeight: 600, fontSize: 13.5 };
const btnGhost = { background: "transparent", color: "#93a2b3", border: "1px solid #2a3746", padding: "8px 14px", borderRadius: 8, fontSize: 13 };
const btnGhostDanger = { background: "transparent", color: "#c47272", border: "1px solid #4a2b2b", padding: "8px 14px", borderRadius: 8, fontSize: 13 };
const dialogStyle = { background: "#161f2b", color: "#eef2f6", border: "1px solid #2a3746", borderRadius: 14, padding: 22, width: "min(460px, 92vw)" };
