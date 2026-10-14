---
title: "io.papermc.paper.registry.data.dialog.input.NumberRangeDialogInput.Builder"
package: "io.papermc.paper.registry.data.dialog.input"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/input/NumberRangeDialogInput.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface NumberRangeDialogInput.Builder**
`@NonExtendable public static interface NumberRangeDialogInput.Builder`
- `@Contract(value="_ -> this", mutates="this") NumberRangeDialogInput.Builder width(@Range(from=1L,to=1024L) int width)`
- `@Contract(value="_ -> this", mutates="this") NumberRangeDialogInput.Builder labelFormat(String labelFormat)`
- `@Contract(value="_ -> this", mutates="this") NumberRangeDialogInput.Builder initial(@Nullable Float initial)`
- `@Contract(value="_ -> this", mutates="this") NumberRangeDialogInput.Builder step(@Positive @Nullable Float step)`
- `@Contract(pure=true, value="-> new") NumberRangeDialogInput build()`
