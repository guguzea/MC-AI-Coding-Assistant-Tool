---
title: "io.papermc.paper.datacomponent.item.LodestoneTracker"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/LodestoneTracker.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface LodestoneTracker**
`@NonExtendable public interface LodestoneTracker`
- `@Contract(value="_, _ -> new", pure=true) static LodestoneTracker lodestoneTracker(@Nullable Location location, boolean tracked)`
- `@Contract(value="-> new", pure=true) static LodestoneTracker.Builder lodestoneTracker()`
- `@Contract(value="-> new", pure=true) @Nullable Location location()`
- `@Contract(pure=true) boolean tracked()`
