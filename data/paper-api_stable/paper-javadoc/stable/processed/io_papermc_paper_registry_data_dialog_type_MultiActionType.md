---
title: "io.papermc.paper.registry.data.dialog.type.MultiActionType"
package: "io.papermc.paper.registry.data.dialog.type"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/type/MultiActionType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface MultiActionType**
`@NonExtendable public non-sealed interface MultiActionType extends DialogType`
- `@Contract(pure=true) @Unmodifiable List<ActionButton> actions()`
- `@Contract(pure=true) @Nullable ActionButton exitAction()`
- `@Contract(pure=true) @Positive int columns()`
