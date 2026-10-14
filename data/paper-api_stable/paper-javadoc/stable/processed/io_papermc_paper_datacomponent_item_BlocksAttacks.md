---
title: "io.papermc.paper.datacomponent.item.BlocksAttacks"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/BlocksAttacks.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BlocksAttacks**
`@NonExtendable public interface BlocksAttacks`
- `@Contract(value="-> new", pure=true) static BlocksAttacks.Builder blocksAttacks()`
- `@Contract(pure=true) @NonNegative float blockDelaySeconds()`
- `@Contract(pure=true) @NonNegative float disableCooldownScale()`
- `@Contract(pure=true) List<DamageReduction> damageReductions()`
- `@Contract(pure=true) ItemDamageFunction itemDamage()`
- `@Contract(pure=true) @Nullable RegistryKeySet<DamageType> bypassedBy()`
- `@Contract(pure=true) @Nullable Key blockSound()`
- `@Contract(pure=true) @Nullable Key disableSound()`
