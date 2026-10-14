---
title: "io.papermc.paper.datacomponent.item.Consumable.Builder"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/Consumable.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Consumable.Builder**
`@NonExtendable public static interface Consumable.Builder extends DataComponentBuilder<Consumable>`
- `@Contract(value="_ -> this", mutates="this") Consumable.Builder consumeSeconds(@NonNegative float consumeSeconds)`
- `@Contract(value="_ -> this", mutates="this") Consumable.Builder animation(ItemUseAnimation animation)`
- `@Contract(value="_ -> this", mutates="this") Consumable.Builder sound(Key sound)`
- `@Contract(value="_ -> this", mutates="this") Consumable.Builder hasConsumeParticles(boolean hasConsumeParticles)`
- `@Contract(value="_ -> this", mutates="this") Consumable.Builder effects(List<ConsumeEffect> effects)`
- `@Contract(value="_ -> this", mutates="this") Consumable.Builder addEffect(ConsumeEffect effect)`
- `@Contract(value="_ -> this", mutates="this") Consumable.Builder addEffects(List<ConsumeEffect> effects)`
