---
title: "io.papermc.paper.registry.data.dialog.body.ItemDialogBody.Builder"
package: "io.papermc.paper.registry.data.dialog.body"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/body/ItemDialogBody.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ItemDialogBody.Builder**
`@NonExtendable public static interface ItemDialogBody.Builder`
- `@Contract(value="_ -> this", mutates="this") ItemDialogBody.Builder description(@Nullable PlainMessageDialogBody description)`
- `@Contract(value="_ -> this", mutates="this") ItemDialogBody.Builder showDecorations(boolean showDecorations)`
- `@Contract(value="_ -> this", mutates="this") ItemDialogBody.Builder showTooltip(boolean showTooltip)`
- `@Contract(value="_ -> this", mutates="this") ItemDialogBody.Builder width(@Range(from=1L,to=256L) int width)`
- `@Contract(value="_ -> this", mutates="this") ItemDialogBody.Builder height(@Range(from=1L,to=256L) int height)`
- `@Contract(value="-> new", pure=true) ItemDialogBody build()`
