---
title: "io.papermc.paper.datacomponent.item.AttackRange"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/AttackRange.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface AttackRange**
`@NonExtendable public interface AttackRange`
- `@Contract(value="-> new", pure=true) static AttackRange.Builder attackRange()`
- `@Contract(pure=true) @Range(from=0L,to=64L) float minReach()`
- `@Contract(pure=true) @Range(from=0L,to=64L) float maxReach()`
- `@Contract(pure=true) @Range(from=0L,to=64L) float minCreativeReach()`
- `@Contract(pure=true) @Range(from=0L,to=64L) float maxCreativeReach()`
- `@Contract(pure=true) @Range(from=0L,to=1L) float hitboxMargin()`
- `@Contract(pure=true) @Range(from=0L,to=2L) float mobFactor()`
