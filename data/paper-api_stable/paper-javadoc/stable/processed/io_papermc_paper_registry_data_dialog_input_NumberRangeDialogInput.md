---
title: "io.papermc.paper.registry.data.dialog.input.NumberRangeDialogInput"
package: "io.papermc.paper.registry.data.dialog.input"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/input/NumberRangeDialogInput.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface NumberRangeDialogInput**
`@NonExtendable public non-sealed interface NumberRangeDialogInput extends DialogInput`
- `@Contract(pure=true) @Range(from=1L,to=1024L) int width()`
- `@Contract(pure=true) Component label()`
- `@Contract(pure=true) String labelFormat()`
- `@Contract(pure=true) float start()`
- `@Contract(pure=true) float end()`
- `@Contract(pure=true) @Nullable Float initial()`
- `@Contract(pure=true) @Positive @Nullable Float step()`
