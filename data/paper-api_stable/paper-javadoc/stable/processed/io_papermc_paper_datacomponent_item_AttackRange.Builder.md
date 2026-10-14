---
title: "io.papermc.paper.datacomponent.item.AttackRange.Builder"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/AttackRange.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface AttackRange.Builder**
`@NonExtendable public static interface AttackRange.Builder extends DataComponentBuilder<AttackRange>`
- `@Contract(value="_ -> this", mutates="this") AttackRange.Builder minReach(@Range(from=0L,to=64L) float minReach)`
- `@Contract(value="_ -> this", mutates="this") AttackRange.Builder maxReach(@Range(from=0L,to=64L) float maxReach)`
- `@Contract(value="_ -> this", mutates="this") AttackRange.Builder minCreativeReach(@Range(from=0L,to=64L) float minCreativeReach)`
- `@Contract(value="_ -> this", mutates="this") AttackRange.Builder maxCreativeReach(@Range(from=0L,to=64L) float maxCreativeReach)`
- `@Contract(value="_ -> this", mutates="this") AttackRange.Builder hitboxMargin(@Range(from=0L,to=1L) float hitboxMargin)`
- `@Contract(value="_ -> this", mutates="this") AttackRange.Builder mobFactor(@Range(from=0L,to=2L) float mobFactor)`
