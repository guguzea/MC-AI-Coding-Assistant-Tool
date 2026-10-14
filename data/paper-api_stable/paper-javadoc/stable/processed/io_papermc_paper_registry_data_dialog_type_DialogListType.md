---
title: "io.papermc.paper.registry.data.dialog.type.DialogListType"
package: "io.papermc.paper.registry.data.dialog.type"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/type/DialogListType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DialogListType**
`@NonExtendable public non-sealed interface DialogListType extends DialogType`
- `@Contract(pure=true) RegistrySet<Dialog> dialogs()`
- `@Contract(pure=true) @Nullable ActionButton exitAction()`
- `@Contract(pure=true) @Positive int columns()`
- `@Contract(pure=true) @Range(from=1L,to=1024L) int buttonWidth()`
