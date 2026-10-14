---
title: "io.papermc.paper.registry.data.dialog.input.SingleOptionDialogInput.OptionEntry"
package: "io.papermc.paper.registry.data.dialog.input"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/input/SingleOptionDialogInput.OptionEntry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SingleOptionDialogInput.OptionEntry**
`@NonExtendable public static interface SingleOptionDialogInput.OptionEntry`
- `@Contract(pure=true, value="_, _, _ -> new") static SingleOptionDialogInput.OptionEntry create(String id, @Nullable Component display, boolean initial)`
- `@Contract(pure=true) String id()`
- `@Contract(pure=true) @Nullable Component display()`
- `@Contract(pure=true) boolean initial()`
