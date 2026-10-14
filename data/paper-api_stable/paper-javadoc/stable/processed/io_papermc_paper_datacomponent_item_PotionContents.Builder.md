---
title: "io.papermc.paper.datacomponent.item.PotionContents.Builder"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/PotionContents.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PotionContents.Builder**
`@NonExtendable public static interface PotionContents.Builder extends DataComponentBuilder<PotionContents>`
- `@Contract(value="_ -> this", mutates="this") PotionContents.Builder potion(@Nullable PotionType type)`
- `@Contract(value="_ -> this", mutates="this") PotionContents.Builder customColor(@Nullable Color color)`
- `@Contract(value="_ -> this", mutates="this") PotionContents.Builder customName(@Nullable String name)`
- `@Contract(value="_ -> this", mutates="this") PotionContents.Builder addCustomEffect(PotionEffect effect)`
- `@Contract(value="_ -> this", mutates="this") PotionContents.Builder addCustomEffects(List<PotionEffect> effects)`
