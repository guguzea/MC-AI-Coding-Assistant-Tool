---
title: "io.papermc.paper.registry.data.dialog.DialogBase"
package: "io.papermc.paper.registry.data.dialog"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/DialogBase.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DialogBase**
`@NonExtendable public interface DialogBase`
- `@Contract(value="_, _, _, _, _, _, _ -> new", pure=true) static DialogBase create(Component title, @Nullable Component externalTitle, boolean canCloseWithEscape, boolean pause, DialogBase.DialogAfterAction afterAction, List<? extends DialogBody> body, List<? extends DialogInput> inputs)`
- `@Contract(value="_ -> new", pure=true) static DialogBase.Builder builder(Component title)`
- `@Contract(pure=true) Component title()`
- `@Contract(pure=true) @Nullable Component externalTitle()`
- `@Contract(pure=true) boolean canCloseWithEscape()`
- `@Contract(pure=true) boolean pause()`
- `@Contract(pure=true) DialogBase.DialogAfterAction afterAction()`
- `@Contract(pure=true) @Unmodifiable List<DialogBody> body()`
- `@Contract(pure=true) @Unmodifiable List<DialogInput> inputs()`
