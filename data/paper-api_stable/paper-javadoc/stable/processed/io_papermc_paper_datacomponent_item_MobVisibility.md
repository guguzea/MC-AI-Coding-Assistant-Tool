---
title: "io.papermc.paper.datacomponent.item.MobVisibility"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/MobVisibility.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface MobVisibility**
`@NonExtendable public interface MobVisibility`
- `@Contract(value="_, _ -> new", pure=true) static MobVisibility mobVisibility(RegistryKeySet<EntityType> targetingEntityTypes, @Range(from=0L,to=10L) float visibility)`
- `@Contract(pure=true) RegistryKeySet<EntityType> targetingEntityTypes()`
- `@Contract(pure=true) @Range(from=0L,to=10L) float visibility()`
