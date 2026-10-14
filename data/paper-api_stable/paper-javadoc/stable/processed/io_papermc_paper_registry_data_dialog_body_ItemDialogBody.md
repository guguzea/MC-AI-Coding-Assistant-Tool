---
title: "io.papermc.paper.registry.data.dialog.body.ItemDialogBody"
package: "io.papermc.paper.registry.data.dialog.body"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/body/ItemDialogBody.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ItemDialogBody**
`@NonExtendable public non-sealed interface ItemDialogBody extends DialogBody`
- `@Contract(pure=true) ItemStack item()`
- `@Contract(pure=true) @Nullable PlainMessageDialogBody description()`
- `@Contract(pure=true) boolean showDecorations()`
- `@Contract(pure=true) boolean showTooltip()`
- `@Contract(pure=true) @Range(from=1L,to=256L) int width()`
- `@Contract(pure=true) @Range(from=1L,to=256L) int height()`
