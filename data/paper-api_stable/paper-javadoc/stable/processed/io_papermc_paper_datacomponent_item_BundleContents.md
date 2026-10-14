---
title: "io.papermc.paper.datacomponent.item.BundleContents"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/BundleContents.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BundleContents**
`@NonExtendable public interface BundleContents`
- `@Contract(value="_ -> new", pure=true) static BundleContents bundleContents(List<ItemStack> contents)`
- `@Contract(value="-> new", pure=true) static BundleContents.Builder bundleContents()`
- `@Contract(pure=true) @Unmodifiable List<ItemStack> contents()`
