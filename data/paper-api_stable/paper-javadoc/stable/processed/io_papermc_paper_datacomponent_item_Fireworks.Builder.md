---
title: "io.papermc.paper.datacomponent.item.Fireworks.Builder"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/Fireworks.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Fireworks.Builder**
`@NonExtendable public static interface Fireworks.Builder extends DataComponentBuilder<Fireworks>`
- `@Contract(value="_ -> this", mutates="this") Fireworks.Builder flightDuration(@IntRange(from=0L,to=255L) int duration)`
- `@Contract(value="_ -> this", mutates="this") Fireworks.Builder addEffect(FireworkEffect effect)`
- `@Contract(value="_ -> this", mutates="this") Fireworks.Builder addEffects(List<FireworkEffect> effects)`
