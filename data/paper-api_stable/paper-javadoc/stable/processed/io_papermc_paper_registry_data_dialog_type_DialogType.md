---
title: "io.papermc.paper.registry.data.dialog.type.DialogType"
package: "io.papermc.paper.registry.data.dialog.type"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/type/DialogType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DialogType**
`public sealed interface DialogType permits ConfirmationType, DialogListType, MultiActionType, NoticeType, ServerLinksType`
- `@Contract(value="_, _ -> new", pure=true) static ConfirmationType confirmation(ActionButton yesButton, ActionButton noButton)`
- `@Contract(value="_, _, _, _ -> new", pure=true) static DialogListType dialogList(RegistrySet<Dialog> dialogs, @Nullable ActionButton exitAction, @Positive int columns, @Range(from=1L,to=1024L) int buttonWidth)`
- `@Contract(value="_ -> new", pure=true) static DialogListType.Builder dialogList(RegistrySet<Dialog> dialogs)`
- `@Contract(value="_, _, _ -> new", pure=true) static MultiActionType multiAction(List<ActionButton> actions, @Nullable ActionButton exitAction, @Positive int columns)`
- `@Contract(value="_ -> new", pure=true) static MultiActionType.Builder multiAction(List<ActionButton> actions)`
- `@Contract(value="-> new", pure=true) static NoticeType notice()`
- `@Contract(value="_ -> new", pure=true) static NoticeType notice(ActionButton action)`
- `@Contract(value="_, _, _ -> new", pure=true) static ServerLinksType serverLinks(@Nullable ActionButton exitAction, @Positive int columns, @Range(from=1L,to=1024L) int buttonWidth)`
