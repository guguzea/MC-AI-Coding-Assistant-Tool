---
title: "io.papermc.paper.datacomponent.item.DeathProtection"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/DeathProtection.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DeathProtection**
`@NonExtendable public interface DeathProtection`
- `@Contract(value="_ -> new", pure=true) static DeathProtection deathProtection(List<ConsumeEffect> deathEffects)`
- `@Contract(value="-> new", pure=true) static DeathProtection.Builder deathProtection()`
- `@Contract(value="-> new", pure=true) @Unmodifiable List<ConsumeEffect> deathEffects()`
