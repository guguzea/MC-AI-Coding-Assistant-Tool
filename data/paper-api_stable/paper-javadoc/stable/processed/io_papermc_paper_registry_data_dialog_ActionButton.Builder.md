---
title: "io.papermc.paper.registry.data.dialog.ActionButton.Builder"
package: "io.papermc.paper.registry.data.dialog"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/ActionButton.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ActionButton.Builder**
`@NonExtendable public static interface ActionButton.Builder`
- `@Contract(value="_ -> this", mutates="this") ActionButton.Builder tooltip(@Nullable Component tooltip)`
- `@Contract(value="_ -> this", mutates="this") ActionButton.Builder width(@Range(from=1L,to=1024L) int width)`
- `@Contract(value="_ -> this", mutates="this") ActionButton.Builder action(@Nullable DialogAction action)`
- `@Contract(value="-> new", pure=true) ActionButton build()`
