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

/** How long an owner has to re-inject before we conclude the styles were stolen. */
const GRACE_MS = 500

/** One stylesheet we can put back. */
interface Snapshot {
  /** Element id (`dsh-notification-style`, …), used for the "owner came back" check. */
  id: string
  /** Attributes to copy verbatim (id, media, nonce, …). */
  attributes: Array<[string, string]>
  text: string
}

/**
 * Mutable state of ONE keeper instance. It is created inside
 * {@link mountStyleKeeper} on purpose: module-level maps would be shared by a
 * second mount, whose disposer would then clear the live instance's snapshots and
 * cancel its pending restores.
 */
interface KeeperState {
  /** Style elements we have seen, with what is needed to restore them. */
  seen: Map<HTMLStyleElement, Snapshot>
  /** Pending restores, so the disposer can cancel them. */
  timers: Set<number>
}

/**
 * Snapshot a stylesheet, if it is one we should keep.
 *
 * The discriminator is `data-plugin-css`: the bundler preset stamps BOTH
 * `data-plugin` and `data-plugin-css="<package>/<file>.css"` on the tags it emits,
 * and those are the loader's to create and destroy (a hot reload deletes them so
 * the preset's guard lets fresh CSS through). A tag without `data-plugin-css` is
 * hand-injected by plugin code and only reaches `apply()` once — whether or not
 * the claim pass has already mistaken it for another plugin's.
 * @param state - this instance's snapshot map.
 * @param node - a `<style>` element.
 */
function remember(state: KeeperState, node: HTMLStyleElement): void {
  if (node.dataset.pluginCss !== undefined) return
  if (state.seen.has(node)) return
  state.seen.set(node, {
    id: node.id,
    attributes: [...node.attributes].map(attr => [attr.name, attr.value]),
    text: node.textContent ?? '',
  })
}

/**
 * Whether an equivalent stylesheet is in the document again.
 * @param snapshot - the stylesheet that disappeared.
 * @returns true when its owner (or an identical injection) is back.
 */
function isBack(snapshot: Snapshot): boolean {
  if (snapshot.id !== '' && document.getElementById(snapshot.id) !== null) return true
  if (snapshot.id !== '') return false
  for (const node of document.querySelectorAll('style')) {
    if ((node.textContent ?? '') === snapshot.text) return true
  }
  return false
}

/**
 * Put a disappeared stylesheet back, unless its owner already re-injected it.
 * @param state - this instance's snapshot map (the restored tag is remembered here).
 * @param snapshot - what to restore.
 */
function restore(state: KeeperState, snapshot: Snapshot): void {
  if (isBack(snapshot)) return
  const style = document.createElement('style')
  for (const [name, value] of snapshot.attributes) {
    // `data-plugin` on a hand-written tag is the claim pass's bookkeeping, not
    // part of the stylesheet's identity: restoring it as authored keeps the tag
    // from being pre-armed for the next thief.
    if (name === 'data-plugin') continue
    style.setAttribute(name, value)
  }
  style.textContent = snapshot.text
  document.head.appendChild(style)
  remember(state, style)
  console.info(`[harness-ui-harmonizer] restored a stolen third-party stylesheet${snapshot.id === '' ? '' : ` (#${snapshot.id})`}`)
}

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
export function mountStyleKeeper(): () => void {
  const state: KeeperState = { seen: new Map(), timers: new Set() }
  for (const node of document.querySelectorAll('style')) {
    if (node instanceof HTMLStyleElement) remember(state, node)
  }
  const observer = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof HTMLStyleElement) remember(state, node)
      }
      for (const node of record.removedNodes) {
        if (!(node instanceof HTMLStyleElement)) continue
        const snapshot = state.seen.get(node)
        if (snapshot === undefined) continue
        state.seen.delete(node)
        const handle = window.setTimeout(() => {
          state.timers.delete(handle)
          restore(state, snapshot)
        }, GRACE_MS)
        state.timers.add(handle)
      }
    }
  })
  // Direct children only: an injected stylesheet is appended to `<head>` (the
  // shipping convention — preset-emitted tags, dsh-notification's hand-written
  // one, this plugin's own tooltip tag), so a subtree observer would walk every
  // streamed turn's DOM for nothing.
  observer.observe(document.head, { childList: true })
  observer.observe(document.body, { childList: true })
  return () => {
    observer.disconnect()
    for (const handle of state.timers) window.clearTimeout(handle)
    state.timers.clear()
    state.seen.clear()
  }
}
