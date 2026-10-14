---
title: "io.papermc.paper.registry.data.dialog.DialogRegistryEntry.Builder"
package: "io.papermc.paper.registry.data.dialog"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/registry/data/dialog/DialogRegistryEntry.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DialogRegistryEntry.Builder**
`@NonExtendable public static interface DialogRegistryEntry.Builder extends DialogRegistryEntry, RegistryBuilder<Dialog>`
- `@Contract(value="-> new", pure=true) RegistryValueSetBuilder<Dialog, DialogRegistryEntry.Builder> registryValueSet()`
- `@Contract(value="_ -> this", mutates="this") DialogRegistryEntry.Builder base(DialogBase dialogBase)`
- `@Contract(value="_ -> this", mutates="this") DialogRegistryEntry.Builder type(DialogType dialogType)`
