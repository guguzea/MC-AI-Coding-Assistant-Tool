---
title: "io.papermc.paper.registry.data.dialog.action.DialogAction"
package: "io.papermc.paper.registry.data.dialog.action"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/action/DialogAction.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DialogAction**
`public sealed interface DialogAction permits DialogAction.CommandTemplateAction, DialogAction.CustomClickAction, DialogAction.StaticAction`
- `@Contract(pure=true, value="_ -> new") static DialogAction.CommandTemplateAction commandTemplate(String template)`
- `@Contract(pure=true, value="_ -> new") static DialogAction.StaticAction staticAction(ClickEvent value)`
- `@Contract(pure=true, value="_, _ -> new") static DialogAction.CustomClickAction customClick(Key id, @Nullable BinaryTagHolder additions)`
- `@Contract(pure=true, value="_, _ -> new") static DialogAction.CustomClickAction customClick(DialogActionCallback callback, ClickCallback.Options options)`
