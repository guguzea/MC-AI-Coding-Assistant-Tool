---
title: "io.papermc.paper.datacomponent.item.Fireworks"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/datacomponent/item/Fireworks.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Contract(value="_, _ -> new", pure=true) static Fireworks fireworks(List<FireworkEffect> effects, int flightDuration)`
- `@Contract(value="-> new", pure=true) static Fireworks.Builder fireworks()`
- `@Contract(pure=true) @Unmodifiable List<FireworkEffect> effects()`
- `@Contract(pure=true) @org.checkerframework.common.value.qual.IntRange(from=0L, to=255L) int flightDuration()`
