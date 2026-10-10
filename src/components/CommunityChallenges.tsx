import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Crown, Heart, MessageCircle, Plus, Send, Trophy, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

type Post = { id: number; name: string; initials: string; time: string; text: string; tag: "Dúvida" | "Conquista" | "Dica"; likes: number; liked: boolean; comments: string[] };
type Friend = { name: string; initials: string; saved: number; self?: boolean };
type Challenge = { id: number; title: string; goal: number; friends: Friend[] };
const INITIAL_POSTS: Post[] = [
  { id: 1, name: "Mariana Costa", initials: "MC", time: "Há 20 min", text: "Consegui guardar meus primeiros R$ 500! Troquei o delivery por comida feita em casa e já senti a diferença. Um passo de cada vez 💚", tag: "Conquista", likes: 24, liked: false, comments: ["Que conquista boa! Parabéns, Mariana 👏", "Também estou nessa meta!"] },
  { id: 2, name: "Pedro Santos", initials: "PS", time: "Há 1 h", text: "Vocês separam o dinheiro das contas assim que o salário cai? Quero começar a me organizar, mas sempre acabo gastando antes.", tag: "Dúvida", likes: 12, liked: false, comments: ["Separo primeiro as contas e o valor que quero guardar."] },
  { id: 3, name: "Ana Oliveira", initials: "AO", time: "Há 2 h", text: "Minha dica da semana: fazer uma lista antes de ir ao mercado. Gastei R$ 80 a menos e não faltou nada em casa 🛒", tag: "Dica", likes: 18, liked: false, comments: [] },
];
const INITIAL_CHALLENGE: Challenge = { id: 1, title: "Viagem de Fim de Ano ✈️", goal: 2000, friends: [
  { name: "Mariana", initials: "MC", saved: 1500 },
  { name: "Você", initials: "VC", saved: 1100, self: true },
  { name: "Pedro", initials: "PS", saved: 700 },
] };
const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const TAG_STYLES = { Dúvida: "bg-muted text-foreground", Conquista: "bg-secondary text-secondary-foreground", Dica: "bg-brand-soft text-brand" };

function Avatar({ initials, self = false }: { initials: string; self?: boolean }) {
  return <div aria-hidden="true" className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-black ${self ? "bg-secondary text-secondary-foreground" : "bg-brand-soft text-brand"}`}>{initials}</div>;
}

export function CommunityChallenges() {
  const [tab, setTab] = useState<"forum" | "challenges">("forum");
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [draft, setDraft] = useState("");
  const [tag, setTag] = useState<Post["tag"]>("Dúvida");
  const [openComments, setOpenComments] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [challenges, setChallenges] = useState([INITIAL_CHALLENGE]);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [friendNames, setFriendNames] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  function publish(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    setPosts(previous => [{ id: Date.now(), name: "Você", initials: "VC", time: "Agora", text: draft.trim(), tag, likes: 0, liked: false, comments: [] }, ...previous]);
    setDraft("");
    setNotice("Sua publicação foi adicionada.");
  }

  function addComment(event: FormEvent, id: number) {
    event.preventDefault();
    if (!comment.trim()) return;
    setPosts(previous => previous.map(post => post.id === id ? { ...post, comments: [...post.comments, comment.trim()] } : post));
    setComment("");
    setNotice("Comentário adicionado.");
  }

  function createChallenge(event: FormEvent) {
    event.preventDefault();
    const amount = Number(goal.replace(",", "."));
    const names = friendNames.split(",").map(name => name.trim()).filter(Boolean);
    if (!title.trim() || !Number.isFinite(amount) || amount <= 0 || names.length === 0 || names.length > 5) {
      setError("Preencha o nome, uma meta maior que zero e de 1 a 5 amigos.");
      return;
    }
    setChallenges(previous => [{ id: Date.now(), title: title.trim(), goal: amount, friends: [{ name: "Você", initials: "VC", saved: 0, self: true }, ...names.map(name => ({ name, initials: name.slice(0, 2).toUpperCase(), saved: 0 }))] }, ...previous]);
    setCreating(false);
    setTitle(""); setGoal(""); setFriendNames(""); setError("");
    setNotice("Desafio criado.");
  }

  return (
    <div className="mx-auto max-w-md space-y-5">
      <header>
        <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-brand"><Users className="h-5 w-5" /> Juntos, vamos mais longe</div>
        <h1 className="text-3xl font-black leading-tight">Comunidade e Desafios</h1>
        <p className="mt-2 text-sm text-muted-foreground">Comunidade de exemplo</p>
      </header>

      <div role="tablist" aria-label="Comunidade" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        <Button id="forum-tab" role="tab" aria-selected={tab === "forum"} aria-controls="forum-panel" variant="ghost" onClick={() => { setTab("forum"); setNotice(""); }} className={`h-12 rounded-lg font-extrabold ${tab === "forum" ? "bg-card text-brand shadow-sm" : "text-muted-foreground"}`}><MessageCircle /> Fórum Global</Button>
        <Button id="challenges-tab" role="tab" aria-selected={tab === "challenges"} aria-controls="challenges-panel" variant="ghost" onClick={() => { setTab("challenges"); setNotice(""); }} className={`h-12 rounded-lg font-extrabold ${tab === "challenges" ? "bg-card text-brand shadow-sm" : "text-muted-foreground"}`}><Trophy /> Meus Desafios</Button>
      </div>
      <p role="status" className="text-sm font-bold text-primary-deep empty:hidden">{notice}</p>

      {tab === "forum" ? <div id="forum-panel" role="tabpanel" aria-labelledby="forum-tab" className="space-y-4">
        <form onSubmit={publish} className="rounded-xl border bg-card p-4 shadow-sm">
          <label htmlFor="post-draft" className="mb-3 block font-extrabold">O que você quer aprender ou compartilhar hoje?</label>
          <Textarea id="post-draft" value={draft} onChange={event => setDraft(event.target.value)} maxLength={1000} placeholder="Sua próxima conquista começa com uma conversa..." className="min-h-24 resize-none rounded-xl bg-background" />
          <div className="mt-3 flex items-center justify-between gap-2">
            <label className="sr-only" htmlFor="post-tag">Tipo de publicação</label>
            <select id="post-tag" value={tag} onChange={event => setTag(event.target.value as Post["tag"])} className="h-11 min-w-0 rounded-lg border bg-background px-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="Dúvida">#Dúvida</option><option value="Conquista">#Conquista</option><option value="Dica">#Dica</option>
            </select>
            <Button type="submit" disabled={!draft.trim()} className="h-11 rounded-xl px-5 font-extrabold"><Send /> Publicar</Button>
          </div>
        </form>
        <div className="flex items-center justify-between"><h2 className="font-black">Na comunidade</h2><span className="text-xs font-bold text-muted-foreground">Mais recentes</span></div>
        {posts.map(post => <article key={post.id} className="rounded-xl border bg-card p-4 shadow-sm">
          <header className="flex items-center gap-3"><Avatar initials={post.initials} self={post.name === "Você"} /><div className="min-w-0 flex-1"><h3 className="break-words font-extrabold">{post.name}</h3><p className="text-xs text-muted-foreground">{post.time}</p></div></header>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-extrabold ${TAG_STYLES[post.tag]}`}>#{post.tag}</span>
          <p className="mt-3 whitespace-pre-wrap break-words text-base leading-relaxed">{post.text}</p>
          <div className="mt-4 flex gap-2 border-t pt-2">
            <Button variant="ghost" aria-label={`Curtir publicação de ${post.name}`} aria-pressed={post.liked} onClick={() => setPosts(previous => previous.map(item => item.id === post.id ? { ...item, liked: !item.liked, likes: item.likes + (item.liked ? -1 : 1) } : item))} className={`h-11 px-3 ${post.liked ? "text-primary-deep" : "text-muted-foreground"}`}><Heart className={post.liked ? "fill-current" : ""} /> {post.likes}</Button>
            <Button variant="ghost" aria-label={`Comentar publicação de ${post.name}`} aria-expanded={openComments === post.id} onClick={() => { setOpenComments(openComments === post.id ? null : post.id); setComment(""); }} className="h-11 px-3 text-muted-foreground"><MessageCircle /> {post.comments.length} <span className="text-xs">Comentar</span></Button>
          </div>
          {openComments === post.id && <div className="mt-2 space-y-3 border-t pt-3">
            {post.comments.map((text, index) => <p key={index} className="break-words rounded-lg bg-muted p-3 text-sm">{text}</p>)}
            <form onSubmit={event => addComment(event, post.id)} className="flex gap-2"><label className="sr-only" htmlFor={`comment-${post.id}`}>Seu comentário</label><Input id={`comment-${post.id}`} value={comment} onChange={event => setComment(event.target.value)} maxLength={500} placeholder="Escreva um comentário" className="h-11 min-w-0 rounded-lg" /><Button type="submit" size="icon" disabled={!comment.trim()} aria-label="Enviar comentário" className="h-11 w-11 shrink-0 rounded-lg"><ArrowRight /></Button></form>
          </div>}
        </article>)}
      </div> : <div id="challenges-panel" role="tabpanel" aria-labelledby="challenges-tab" className="space-y-5">
        <Button onClick={() => { setCreating(!creating); setError(""); }} className="h-14 w-full whitespace-normal rounded-xl text-base font-extrabold"><Plus /> Criar Desafio com Amigos</Button>
        {creating && <form onSubmit={createChallenge} className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between"><h2 className="font-black">Novo desafio</h2><Button type="button" variant="ghost" size="icon" aria-label="Cancelar criação" onClick={() => setCreating(false)}><X /></Button></div>
          <label className="block text-sm font-bold" htmlFor="challenge-title">Nome do desafio</label><Input id="challenge-title" value={title} onChange={event => setTitle(event.target.value)} maxLength={80} placeholder="Minha próxima conquista" />
          <label className="block text-sm font-bold" htmlFor="challenge-goal">Meta por pessoa (R$)</label><Input id="challenge-goal" inputMode="decimal" value={goal} onChange={event => setGoal(event.target.value)} placeholder="2000" />
          <label className="block text-sm font-bold" htmlFor="challenge-friends">Amigos (nomes separados por vírgula)</label><Input id="challenge-friends" value={friendNames} onChange={event => setFriendNames(event.target.value)} maxLength={200} placeholder="Ana, Pedro" />
          {error && <p role="alert" className="text-sm font-bold text-destructive">{error}</p>}
          <Button type="submit" className="h-12 w-full rounded-xl font-bold"><Check /> Criar desafio</Button>
        </form>}
        {challenges.map(challenge => {
          const friends = [...challenge.friends].sort((a, b) => b.saved - a.saved);
          return <article key={challenge.id} className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <header className="border-b bg-secondary/50 p-5">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-secondary-foreground"><span className="h-2 w-2 rounded-full bg-primary" /> Desafio ativo</span>
              <h2 className="mt-2 break-words text-xl font-black">{challenge.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Meta por pessoa</p><p className="text-3xl font-black text-primary-deep">{money(challenge.goal)}</p>
              <div className="mt-3 flex items-center gap-1 text-sm font-bold text-secondary-foreground"><Users className="h-4 w-4" /> {friends.length} participantes</div>
            </header>
            <div className="p-5"><h3 className="mb-5 flex items-center gap-2 font-black"><Trophy className="h-5 w-5 text-gold" /> Ranking dos amigos</h3>
              <ol className="space-y-6">{friends.map((friend, index) => {
                const percent = Math.min(100, Math.round(friend.saved / challenge.goal * 100));
                const leader = index === 0 && friend.saved > 0;
                return <li key={`${index}-${friend.name}`}>
                  <div className="flex items-center gap-2"><span className={`w-5 shrink-0 text-sm font-black ${leader ? "text-primary-deep" : "text-muted-foreground"}`}>{index + 1}º</span><Avatar initials={friend.initials} self={friend.self ?? false} /><div className="min-w-0 flex-1"><p className="flex items-center gap-1 font-extrabold"><span className="break-words">{friend.name}</span>{leader && <Crown aria-label="Primeiro lugar" className="h-4 w-4 shrink-0 text-gold" />}</p><p className="text-xs font-bold text-muted-foreground">{money(friend.saved)}</p></div><span className="shrink-0 text-sm font-black">{percent}%</span></div>
                  <Progress value={percent} aria-valuenow={percent} aria-label={`Progresso de ${friend.name}`} className={`mt-3 h-3 bg-muted motion-reduce:[&>div]:transition-none ${leader ? "[&>div]:bg-primary" : friend.self ? "[&>div]:bg-brand" : "[&>div]:bg-locked"}`} />
                </li>;
              })}</ol>
            </div>
          </article>;
        })}
      </div>}
    </div>
  );
}