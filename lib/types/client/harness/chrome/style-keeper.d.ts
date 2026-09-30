/**
 * Third-party stylesheet keeper — restores a hand-injected `<style>` the loader stole.
 *
 * Layer: harness/chrome (DOM behaviour aimed at the DSH client-module loader, i.e.
 * the shell's own runtime, not any one plugin). Seams: the loader's own tag
 * attributes `data-plugin` / `data-plugin-css` plus the element id a hand-injected
 * sheet carries; no third-party private class names.
 *
 * WHY THIS EXISTS (measured, 2026-09-30)
 *
 * The product's client-module loader inventories injected styles per plugin:
 *
 *   const claimStyles = (id) => {
 *     // preset-emitted tags arrive pre-tagged with data-plugin; any untagged tag
 *     // is claimed for the materializing plugin (HMR bookkeeping).
 *     for (const el of document.querySelectorAll("style:not([data-plugin])"))
 *       el.setAttribute("data-plugin", id);
 *     ...
 *   };
 *   const removeOwnedStyles = (id) => {
 *     for (const el of document.querySelectorAll("style[data-plugin]"))
 *       if (el.getAttribute("data-plugin") === id) el.remove();
 *   };
 *
 * `claimStyles` runs after EVERY module factory materializes and claims every
 * untagged `<style>` in the document — not only the ones that factory just
 * added. A plugin that injects its stylesheet by hand in `apply()` (no bundler
 * preset, so no `data-plugin` attribute) is therefore adopted by whichever
 * plugin materializes next, and `removeOwnedStyles` deletes it the moment that
 * adopter reloads, unloads or is pruned by a graph update. Because such plugins
 * inject idempotently (`if (document.getElementById(ID)) return` inside
 * `apply()`, which only runs once), the loss is permanent for the session: the
 * settings page keeps rendering as unstyled HTML until a full page reload.
 *
 * Observed symptom: dsh-notification's 通知 page rendered as a raw text dump in
 * the desktop app (no cards, no badges, default browser buttons) while the same
 * bundle rendered correctly against the same markup in a web probe — and
 * `#dsh-notification-style` was simply absent from the document.
 *
 * WHAT IT DOES
 *
 * Snapshot every untagged stylesheet, and if one disappears, restore it after a
 * short grace period — unless a stylesheet with the same identity is already
 * back, which is exactly what happens when its owner legitimately hot-reloaded
 * and re-injected (the loader removes the tag first so the idempotent guard lets
 * the fresh CSS through). That ordering keeps HMR fresh AND survives a theft:
 * the owner is never the one being reloaded when the thief unloads.
 *
 * The restored node is left untagged, exactly as the original was, so the loader
 * keeps full ownership semantics; it is the owner's stylesheet, not ours to mark
 * or to delete — dispose therefore leaves it in place.
 *
 * WHICH SHEETS: `data-plugin-css` is the discriminator. The bundler preset stamps
 * both attributes on the tags it emits, and those belong to the loader (a hot
 * reload deletes them so the preset's own guard lets the new CSS through). A tag
 * WITHOUT `data-plugin-css` was injected by plugin code and only ever runs once —
 * including one the claim pass has ALREADY mis-adopted (it then carries
 * `data-plugin` with no `data-plugin-css`), which is exactly the state a probe
 * finds in a session that has already lost the styles.
 *
 * TRADE-OFF (documented, not hidden): a plugin disabled mid-session keeps its
 * hand-injected stylesheet until the next page load. Its DOM is unmounted at the
 * same moment, so nothing is painted with it; the alternative — losing the
 * stylesheet for every plugin still on screen — is the reported bug.
 */
/**
 * Mount the stylesheet keeper.
 *
 * Observes the whole tree for `<style>` nodes appearing (any plugin may inject
 * at any time) and disappearing (the theft), and restores the disappeared ones
 * after {@link GRACE_MS}. Nothing is written to a stylesheet's content, and no
 * attribute is added to a foreign tag, so an untouched document stays untouched.
 *
 * All state is per mount (see {@link KeeperState}), so two mounts never share
 * snapshots or timers.
 * @returns disposer: stops watching and cancels pending restores.
 */
export declare function mountStyleKeeper(): () => void;
