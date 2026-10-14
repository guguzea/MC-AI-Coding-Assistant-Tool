---
title: "io.papermc.paper.registry.data.dialog.input.TextDialogInput"
package: "io.papermc.paper.registry.data.dialog.input"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/input/TextDialogInput.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface TextDialogInput**
`@NonExtendable public non-sealed interface TextDialogInput extends DialogInput`
- `@Contract(pure=true) @Range(from=1L,to=1024L) int width()`
- `@Contract(pure=true) Component label()`
- `@Contract(pure=true) boolean labelVisible()`
- `@Contract(pure=true) String initial()`
- `@Contract(pure=true) @Positive int maxLength()`
- `@Contract(pure=true) @Nullable TextDialogInput.MultilineOptions multiline()`
