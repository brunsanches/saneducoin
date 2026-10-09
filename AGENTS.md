<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Lesson content, levels and glossary live in `src/data/lessons.ts`; edit content there, not in routes. Why: one source of truth for the trail.
- Game progress (XP, streak, badges) lives in `src/lib/game.ts` as a localStorage store read via `useSyncExternalStore`. Why: no login yet; server snapshot avoids hydration mismatch.
- App screens wrap in `AppShell` (mobile column + bottom nav). Why: consistent mobile-first chrome.
- Keep the existing game storage key across app name changes. Why: preserve progress saved on the device.
- The expense tracker uses component-local React state initialized with illustrative expenses, not the game store. Why: this tool is a mock-data experience without persistence or XP changes.
