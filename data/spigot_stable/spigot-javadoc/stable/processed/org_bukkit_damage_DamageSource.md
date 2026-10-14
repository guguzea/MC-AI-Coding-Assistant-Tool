---
title: "org.bukkit.damage.DamageSource"
package: "org.bukkit.damage"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/damage/DamageSource.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface DamageSource**
`public interface DamageSource`
- `@NotNull DamageType getDamageType()`
- `@Nullable Entity getCausingEntity()`
- `@Nullable Entity getDirectEntity()`
- `@Nullable Location getDamageLocation()`
- `@Nullable Location getSourceLocation()`
- `boolean isIndirect()`
- `float getFoodExhaustion()`
- `boolean scalesWithDifficulty()`
- `@NotNull static DamageSource.Builder builder(@NotNull DamageType damageType)`
