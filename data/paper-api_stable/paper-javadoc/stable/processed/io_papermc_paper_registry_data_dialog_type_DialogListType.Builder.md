---
title: "io.papermc.paper.registry.data.dialog.type.DialogListType.Builder"
package: "io.papermc.paper.registry.data.dialog.type"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/type/DialogListType.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DialogListType.Builder**
`@NonExtendable public static interface DialogListType.Builder`
- `@Contract(value="_ -> this", mutates="this") DialogListType.Builder exitAction(@Nullable ActionButton exitAction)`
- `@Contract(value="_ -> this", mutates="this") DialogListType.Builder columns(@Positive int columns)`
- `@Contract(value="_ -> this", mutates="this") DialogListType.Builder buttonWidth(@Range(from=1L,to=1024L) int buttonWidth)`
- `@Contract(value="-> new", pure=true) DialogListType build()`
