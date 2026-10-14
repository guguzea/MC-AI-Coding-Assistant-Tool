---
title: "io.papermc.paper.dialog.Dialog"
package: "io.papermc.paper.dialog"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/dialog/Dialog.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Dialog**
`@NonExtendable public interface Dialog extends Keyed, DialogLike`
- `static final Dialog CUSTOM_OPTIONS`
- `static final Dialog QUICK_ACTIONS`
- `static final Dialog SERVER_LINKS`
- `static Dialog create(Consumer<RegistryBuilderFactory<Dialog, ? extends DialogRegistryEntry.Builder>> value)`
- `@Deprecated(since="1.21.8", forRemoval=true) NamespacedKey getKey()`
- `@Deprecated(since="1.21.8", forRemoval=true) default Key key()`
