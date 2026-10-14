---
title: "org.bukkit.damage.DamageSource"
package: "org.bukkit.damage"
source: https://jd.papermc.io/paper/26.3/org/bukkit/damage/DamageSource.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface DamageSource**
`public interface DamageSource`
- `@NotNull @NotNull DamageType getDamageType()`
- `@Nullable @Nullable Entity getCausingEntity()`
- `@Nullable @Nullable Entity getDirectEntity()`
- `@Nullable @Nullable Location getDamageLocation()`
- `@Nullable @Nullable Location getSourceLocation()`
- `boolean isIndirect()`
- `float getFoodExhaustion()`
- `boolean scalesWithDifficulty()`
- `@Experimental @NotNull @NotNull Pointers getDamageContext()`
- `@NotNull static @NotNull DamageSource.Builder builder(@NotNull @NotNull DamageType damageType)`
