---
title: "org.bukkit.damage.DamageSource"
package: "org.bukkit.damage"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/damage/DamageSource.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull DamageType getDamageType()`
- `@Nullable @Nullable Entity getCausingEntity()`
- `@Nullable @Nullable Entity getDirectEntity()`
- `@Nullable @Nullable Location getDamageLocation()`
- `@Nullable @Nullable Location getSourceLocation()`
- `boolean isIndirect()`
- `float getFoodExhaustion()`
- `boolean scalesWithDifficulty()`
- `@NotNull static @NotNull DamageSource.Builder builder(@NotNull @NotNull DamageType damageType)`
