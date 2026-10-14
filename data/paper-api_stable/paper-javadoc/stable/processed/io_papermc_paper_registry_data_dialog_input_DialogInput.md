---
title: "io.papermc.paper.registry.data.dialog.input.DialogInput"
package: "io.papermc.paper.registry.data.dialog.input"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/input/DialogInput.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DialogInput**
`public sealed interface DialogInput permits BooleanDialogInput, NumberRangeDialogInput, SingleOptionDialogInput, TextDialogInput`
- `@Contract(pure=true, value="_, _, _, _, _ -> new") static BooleanDialogInput bool(String key, Component label, boolean initial, String onTrue, String onFalse)`
- `@Contract(pure=true, value="_, _ -> new") static BooleanDialogInput.Builder bool(String key, Component label)`
- `@Contract(pure=true, value="_, _, _, _, _, _, _, _ -> new") static NumberRangeDialogInput numberRange(String key, @Range(from=1L,to=1024L) int width, Component label, String labelFormat, float start, float end, @Nullable Float initial, @Positive @Nullable Float step)`
- `@Contract(pure=true, value="_, _, _, _ -> new") static NumberRangeDialogInput.Builder numberRange(String key, Component label, float start, float end)`
- `@Contract(pure=true, value="_, _, _, _, _ -> new") static SingleOptionDialogInput singleOption(String key, @Range(from=1L,to=1024L) int width, List<SingleOptionDialogInput.OptionEntry> entries, Component label, boolean labelVisible)`
- `@Contract(pure=true, value="_, _, _ -> new") static SingleOptionDialogInput.Builder singleOption(String key, Component label, List<SingleOptionDialogInput.OptionEntry> entries)`
- `@Contract(pure=true, value="_, _, _, _, _, _, _ -> new") static TextDialogInput text(String key, @Range(from=1L,to=1024L) int width, Component label, boolean labelVisible, String initial, @Positive int maxLength, @Nullable TextDialogInput.MultilineOptions multilineOptions)`
- `@Contract(value="_, _ -> new", pure=true) static TextDialogInput.Builder text(String key, Component label)`
- `@Contract(pure=true) String key()`
