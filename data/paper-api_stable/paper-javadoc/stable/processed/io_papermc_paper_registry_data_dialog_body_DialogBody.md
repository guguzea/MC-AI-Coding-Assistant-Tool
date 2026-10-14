---
title: "io.papermc.paper.registry.data.dialog.body.DialogBody"
package: "io.papermc.paper.registry.data.dialog.body"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/body/DialogBody.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DialogBody**
`public sealed interface DialogBody permits ItemDialogBody, PlainMessageDialogBody`
- `@Contract(pure=true, value="_, _, _, _, _, _ -> new") static ItemDialogBody item(ItemStack item, @Nullable PlainMessageDialogBody description, boolean showDecorations, boolean showTooltip, @Range(from=1L,to=256L) int width, @Range(from=1L,to=256L) int height)`
- `@Contract(pure=true, value="_ -> new") static ItemDialogBody.Builder item(ItemStack item)`
- `@Contract(pure=true, value="_ -> new") static PlainMessageDialogBody plainMessage(Component contents)`
- `@Contract(pure=true, value="_, _ -> new") static PlainMessageDialogBody plainMessage(Component contents, @Range(from=1L,to=1024L) int width)`
