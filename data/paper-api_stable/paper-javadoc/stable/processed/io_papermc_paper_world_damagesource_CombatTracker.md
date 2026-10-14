---
title: "io.papermc.paper.world.damagesource.CombatTracker"
package: "io.papermc.paper.world.damagesource"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/world/damagesource/CombatTracker.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface CombatTracker**
`@NullMarked @NonExtendable public interface CombatTracker`
- `LivingEntity getEntity()`
- `List<CombatEntry> getCombatEntries()`
- `void setCombatEntries(List<CombatEntry> combatEntries)`
- `@Nullable CombatEntry computeMostSignificantFall()`
- `boolean isInCombat()`
- `boolean isTakingDamage()`
- `int getCombatDuration()`
- `void addCombatEntry(CombatEntry combatEntry)`
- `Component getDeathMessage()`
- `void resetCombatState()`
- `@Nullable FallLocationType calculateFallLocationType()`
- `int getLastDamageTime()`
