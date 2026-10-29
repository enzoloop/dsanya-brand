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

- Keep homepage copy and editable collection data in `src/lib/site-content.ts`, with reusable section UI under `src/components/home`, so content changes stay separate from layout.
- All images must be real files under `src/assets/` imported in code (Vite bundles and hashes them). Never reference Lovable asset CDN URLs (`/__l5e/assets-v1/...`) — they only resolve on Lovable hosting and break when the site is self-hosted, e.g. on Vercel.
