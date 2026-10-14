---
title: "io.papermc.paper.registry.data.dialog.DialogBase.Builder"
package: "io.papermc.paper.registry.data.dialog"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/DialogBase.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DialogBase.Builder**
`@NonExtendable public static interface DialogBase.Builder`
- `@Contract(value="_ -> this", mutates="this") DialogBase.Builder externalTitle(@Nullable Component externalTitle)`
- `@Contract(value="_ -> this", mutates="this") DialogBase.Builder canCloseWithEscape(boolean canCloseWithEscape)`
- `@Contract(value="_ -> this", mutates="this") DialogBase.Builder pause(boolean pause)`
- `@Contract(value="_ -> this", mutates="this") DialogBase.Builder afterAction(DialogBase.DialogAfterAction afterAction)`
- `@Contract(value="_ -> this", mutates="this") DialogBase.Builder body(List<? extends DialogBody> body)`
- `@Contract(value="_ -> this", mutates="this") DialogBase.Builder inputs(List<? extends DialogInput> inputs)`
- `@Contract(pure=true, value="-> new") DialogBase build()`
