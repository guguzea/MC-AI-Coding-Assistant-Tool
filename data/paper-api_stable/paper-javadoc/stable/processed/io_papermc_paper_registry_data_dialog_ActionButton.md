---
title: "io.papermc.paper.registry.data.dialog.ActionButton"
package: "io.papermc.paper.registry.data.dialog"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/ActionButton.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ActionButton**
`@NonExtendable public interface ActionButton`
- `@Contract(value="_, _, _, _ -> new", pure=true) static ActionButton create(Component label, @Nullable Component tooltip, @Range(from=1L,to=1024L) int width, @Nullable DialogAction action)`
- `@Contract(pure=true, value="_ -> new") static ActionButton.Builder builder(Component label)`
- `@Contract(pure=true) Component label()`
- `@Contract(pure=true) @Nullable Component tooltip()`
- `@Contract(pure=true) @Range(from=1L,to=1024L) int width()`
- `@Contract(pure=true) @Nullable DialogAction action()`
