import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CommunityChallenges } from "@/components/CommunityChallenges";

export const Route = createFileRoute("/comunidade")({
  head: () => ({ meta: [
    { title: "Comunidade e Desafios: Educoin" },
    { name: "description", content: "Compartilhe conquistas financeiras e explore desafios de economia entre amigos na comunidade de exemplo da Educoin." },
    { property: "og:title", content: "Comunidade e Desafios: Educoin" },
    { property: "og:description", content: "Converse sobre dinheiro e acompanhe metas de economia em um ranking de amigos." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: CommunityPage,
});

function CommunityPage() {
  return <AppShell><CommunityChallenges /></AppShell>;
}