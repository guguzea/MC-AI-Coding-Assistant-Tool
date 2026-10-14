---
title: "io.papermc.paper.datacomponent.item.ResolvableProfile.SkinPatch"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/ResolvableProfile.SkinPatch.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ResolvableProfile.SkinPatch**
`@NonExtendable public static interface ResolvableProfile.SkinPatch`
- `static ResolvableProfile.SkinPatch empty()`
- `@Contract(value="-> new", pure=true) static ResolvableProfile.SkinPatchBuilder skinPatch()`
- `@Nullable Key body()`
- `@Nullable Key cape()`
- `@Nullable Key elytra()`
- `@Nullable PlayerTextures.SkinModel model()`
- `default boolean isEmpty()`
