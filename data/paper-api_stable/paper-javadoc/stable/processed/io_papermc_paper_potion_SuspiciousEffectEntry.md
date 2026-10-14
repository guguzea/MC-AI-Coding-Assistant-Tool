---
title: "io.papermc.paper.potion.SuspiciousEffectEntry"
package: "io.papermc.paper.potion"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/potion/SuspiciousEffectEntry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SuspiciousEffectEntry**
`@NullMarked public sealed interface SuspiciousEffectEntry`
- `PotionEffectType effect()`
- `int duration()`
- `@Contract(value="_, _ -> new", pure=true) static SuspiciousEffectEntry create(PotionEffectType effectType, int duration)`
