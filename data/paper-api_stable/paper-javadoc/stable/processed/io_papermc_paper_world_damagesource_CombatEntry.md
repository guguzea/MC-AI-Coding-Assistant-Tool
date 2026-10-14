---
title: "io.papermc.paper.world.damagesource.CombatEntry"
package: "io.papermc.paper.world.damagesource"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/world/damagesource/CombatEntry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface CombatEntry**
`@NullMarked @NonExtendable public interface CombatEntry`
- `DamageSource getDamageSource()`
- `float getDamage()`
- `@Nullable FallLocationType getFallLocationType()`
- `float getFallDistance()`
- `static CombatEntry combatEntry(LivingEntity entity, DamageSource damageSource, float damage)`
- `static CombatEntry combatEntry(DamageSource damageSource, float damage, @Nullable FallLocationType fallLocationType, float fallDistance)`
