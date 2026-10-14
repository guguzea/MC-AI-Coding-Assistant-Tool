---
title: "io.papermc.paper.datacomponent.item.PotDecorations"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/PotDecorations.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PotDecorations**
`@NonExtendable public interface PotDecorations`
- `@Contract(value="_, _, _, _ -> new", pure=true) static PotDecorations potDecorations(@Nullable ItemType back, @Nullable ItemType left, @Nullable ItemType right, @Nullable ItemType front)`
- `@Contract(value="-> new", pure=true) static PotDecorations.Builder potDecorations()`
- `@Contract(pure=true) @Nullable ItemType back()`
- `@Contract(pure=true) @Nullable ItemType left()`
- `@Contract(pure=true) @Nullable ItemType right()`
- `@Contract(pure=true) @Nullable ItemType front()`
