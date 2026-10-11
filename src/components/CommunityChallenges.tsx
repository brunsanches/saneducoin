import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Crown, Heart, Link, MessageCircle, MoreVertical, Plus, Search, Send, Trophy, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Post = { id: number; name: string; initials: string; time: string; text: string; tag: "Dúvida" | "Conquista" | "Dica"; likes: number; liked: boolean; comments: string[] };
type Friend = { name: string; initials: string; saved: number; self?: boolean };
type SuggestedFriend = { id: number; name: string; username: string; initials: string };
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
const SUGGESTED_FRIENDS: SuggestedFriend[] = [
  { id: 1, name: "Juliana Alves", username: "@juliana.alves", initials: "JA" },
  { id: 2, name: "Rafael Souza", username: "@rafa.souza", initials: "RS" },
  { id: 3, name: "Camila Ferreira", username: "@camila.f", initials: "CF" },
];
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
  const [findingFriends, setFindingFriends] = useState(false);
  const [search, setSearch] = useState("");
  const [addedFriends, setAddedFriends] = useState<number[]>([]);
  const [leavingChallenge, setLeavingChallenge] = useState<Challenge | null>(null);

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

  function leaveChallenge() {
    if (!leavingChallenge) return;
    setChallenges(previous => previous.filter(challenge => challenge.id !== leavingChallenge.id));
    setLeavingChallenge(null);
    setNotice("Você saiu do desafio.");
  }

  const query = search.trim().toLowerCase();
  const visibleFriends = query
    ? SUGGESTED_FRIENDS.filter(friend => friend.name.toLowerCase().includes(query) || friend.username.toLowerCase().includes(query))
    : SUGGESTED_FRIENDS;

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
        <div className="grid gap-3">
          <Button onClick={() => { setCreating(!creating); setError(""); }} className="h-14 w-full whitespace-normal rounded-xl text-base font-extrabold"><Plus /> Criar Desafio com Amigos</Button>
          <Button onClick={() => { setFindingFriends(true); setSearch(""); }} variant="outline" className="h-14 w-full whitespace-normal rounded-xl text-base font-extrabold"><Users /> Encontrar Amigos</Button>
        </div>
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
            <header className="relative border-b bg-secondary/50 p-5">
              <div className="absolute right-3 top-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={`Opções do desafio ${challenge.title}`} className="h-10 w-10 rounded-lg text-muted-foreground"><MoreVertical /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    <DropdownMenuItem onSelect={() => setLeavingChallenge(challenge)} className="gap-2 font-extrabold text-destructive focus:text-destructive"><X /> Sair do Desafio</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-secondary-foreground"><span className="h-2 w-2 rounded-full bg-primary" /> Desafio ativo</span>
              <h2 className="mt-2 break-words pr-10 text-xl font-black">{challenge.title}</h2>
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

      <Dialog open={findingFriends} onOpenChange={setFindingFriends}>
        <DialogContent className="max-w-md rounded-xl bg-card p-5 sm:rounded-xl">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl font-black">Encontrar Amigos</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Busque pessoas da comunidade ou convide quem você já conhece.</DialogDescription>
          </DialogHeader>
          <div className="relative mt-1">
            <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={event => setSearch(event.target.value)} maxLength={80} placeholder="Buscar por @usuario ou nome" aria-label="Buscar por @usuario ou nome" className="h-12 rounded-xl pl-11" />
          </div>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto" aria-label="Pessoas sugeridas">
            {visibleFriends.map(friend => {
              const added = addedFriends.includes(friend.id);
              return <li key={friend.id} className="flex items-center gap-3 rounded-xl border bg-background p-3">
                <Avatar initials={friend.initials} />
                <div className="min-w-0 flex-1"><p className="break-words font-extrabold">{friend.name}</p><p className="break-words text-xs font-bold text-muted-foreground">{friend.username}</p></div>
                <Button aria-pressed={added} onClick={() => setAddedFriends(previous => added ? previous.filter(id => id !== friend.id) : [...previous, friend.id])} className={`h-10 shrink-0 rounded-lg px-4 font-extrabold ${added ? "bg-primary text-primary-foreground" : ""}`} variant={added ? "default" : "outline"}>{added ? "Adicionado" : "Adicionar"}</Button>
              </li>;
            })}
            {visibleFriends.length === 0 && <li className="rounded-xl bg-muted p-3 text-sm font-bold text-muted-foreground">Ninguém encontrado com esse nome.</li>}
          </ul>
          <div className="my-4 flex items-center gap-3" role="separator" aria-label="ou">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-black text-muted-foreground">OU</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <Button onClick={() => setNotice("Convite copiado! Compartilhe com seus amigos e ganhe 50 XP.")} className="h-14 w-full whitespace-normal rounded-xl text-base font-extrabold"><Link /> Convidar via Link</Button>
          <p className="mt-2 text-center text-sm font-bold text-muted-foreground">Convide amigos para o app e ganhe 50 XP</p>
        </DialogContent>
      </Dialog>

      <Dialog open={leavingChallenge !== null} onOpenChange={open => { if (!open) setLeavingChallenge(null); }}>
        <DialogContent className="max-w-sm rounded-xl bg-card p-5 text-center sm:rounded-xl">
          <DialogHeader className="items-center text-center">
            <DialogTitle className="text-xl font-black">Sair do Desafio?</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Tem certeza que deseja sair? Seu progresso atual nesta meta será perdido e seus amigos serão notificados.</DialogDescription>
          </DialogHeader>
          <div className="mt-4 grid gap-3">
            <Button variant="outline" onClick={() => setLeavingChallenge(null)} className="h-12 rounded-xl font-extrabold">Cancelar</Button>
            <Button variant="destructive" onClick={leaveChallenge} className="h-12 rounded-xl font-extrabold">Sim, Quero Sair</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
