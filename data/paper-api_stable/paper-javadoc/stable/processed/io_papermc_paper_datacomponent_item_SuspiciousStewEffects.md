---
title: "io.papermc.paper.datacomponent.item.SuspiciousStewEffects"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/SuspiciousStewEffects.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SuspiciousStewEffects**
`@NonExtendable public interface SuspiciousStewEffects`
- `@Contract(value="_ -> new", pure=true) static SuspiciousStewEffects suspiciousStewEffects(Collection<SuspiciousEffectEntry> effects)`
- `@Contract(value="-> new", pure=true) static SuspiciousStewEffects.Builder suspiciousStewEffects()`
- `@Contract(pure=true) @Unmodifiable List<SuspiciousEffectEntry> effects()`
