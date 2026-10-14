---
title: "io.papermc.paper.datacomponent.item.BlocksAttacks.Builder"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/BlocksAttacks.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BlocksAttacks.Builder**
`@NonExtendable public static interface BlocksAttacks.Builder extends DataComponentBuilder<BlocksAttacks>`
- `@Contract(value="_ -> this", mutates="this") BlocksAttacks.Builder blockDelaySeconds(@NonNegative float delay)`
- `@Contract(value="_ -> this", mutates="this") BlocksAttacks.Builder disableCooldownScale(@NonNegative float scale)`
- `@Contract(value="_ -> this", mutates="this") BlocksAttacks.Builder addDamageReduction(DamageReduction reduction)`
- `@Contract(value="_ -> this", mutates="this") BlocksAttacks.Builder damageReductions(List<DamageReduction> reductions)`
- `@Contract(value="_ -> this", mutates="this") BlocksAttacks.Builder itemDamage(ItemDamageFunction function)`
- `@Contract(value="_ -> this", mutates="this") BlocksAttacks.Builder bypassedBy(@Nullable RegistryKeySet<DamageType> bypassedBy)`
- `@Contract(value="_ -> this", mutates="this") BlocksAttacks.Builder blockSound(@Nullable Key sound)`
- `@Contract(value="_ -> this", mutates="this") BlocksAttacks.Builder disableSound(@Nullable Key sound)`
