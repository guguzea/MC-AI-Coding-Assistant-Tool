---
title: "io.papermc.paper.registry.data.dialog.input.TextDialogInput.Builder"
package: "io.papermc.paper.registry.data.dialog.input"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/input/TextDialogInput.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface TextDialogInput.Builder**
`@NonExtendable public static interface TextDialogInput.Builder`
- `@Contract(value="_ -> this", mutates="this") TextDialogInput.Builder width(@Range(from=1L,to=1024L) int width)`
- `@Contract(value="_ -> this", mutates="this") TextDialogInput.Builder labelVisible(boolean labelVisible)`
- `@Contract(value="_ -> this", mutates="this") TextDialogInput.Builder initial(String initial)`
- `@Contract(value="_ -> this", mutates="this") TextDialogInput.Builder maxLength(@Positive int maxLength)`
- `@Contract(value="_ -> this", mutates="this") TextDialogInput.Builder multiline(@Nullable TextDialogInput.MultilineOptions multiline)`
- `@Contract(value="-> new", pure=true) TextDialogInput build()`
