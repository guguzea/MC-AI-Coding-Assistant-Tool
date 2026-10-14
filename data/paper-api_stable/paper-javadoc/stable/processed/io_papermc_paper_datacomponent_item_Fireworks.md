---
title: "io.papermc.paper.datacomponent.item.Fireworks"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/Fireworks.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Fireworks**
`@NonExtendable public interface Fireworks`
- `@Contract(value="_, _ -> new", pure=true) static Fireworks fireworks(List<FireworkEffect> effects, int flightDuration)`
- `@Contract(value="-> new", pure=true) static Fireworks.Builder fireworks()`
- `@Contract(pure=true) @Unmodifiable List<FireworkEffect> effects()`
- `@Contract(pure=true) @IntRange(from=0L,to=255L) int flightDuration()`
