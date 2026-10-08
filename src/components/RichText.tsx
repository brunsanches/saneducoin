import { HelpCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GLOSSARY } from "@/data/lessons";

export function Termo({ term }: { term: string }) {
  return (
    <Popover>
      <PopoverTrigger className="inline-flex items-center gap-0.5 rounded-md bg-brand-soft px-1 font-bold text-brand">
        {term}
        <HelpCircle className="h-4 w-4" />
      </PopoverTrigger>
      <PopoverContent className="w-72 rounded-2xl text-base">
        <p className="font-extrabold text-brand">{term}</p>
        <p className="mt-1 text-muted-foreground">{GLOSSARY[term] ?? "Explicação em breve."}</p>
      </PopoverContent>
    </Popover>
  );
}

export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[\[[^\]]+\]\])/g);
  return (
    <>
      {parts.map((p, i) => {
        const m = p.match(/^\[\[(.+)\]\]$/);
        return m ? <Termo key={i} term={m[1] ?? ""} /> : <span key={i}>{p}</span>;
      })}
    </>
  );
}
