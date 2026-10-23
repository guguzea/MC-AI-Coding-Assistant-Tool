---
title: "org.bukkit.entity.Damageable"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/entity/Damageable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `void damage(double amount)`
- `void damage(double amount, @Nullable @Nullable Entity source)`
- `@Experimental void damage(double amount, @NotNull @NotNull DamageSource damageSource)`
- `double getHealth()`
- `void setHealth(double health)`
- `default void heal(double amount)`
- `void heal(double amount, @NotNull EntityRegainHealthEvent.RegainReason reason)`
- `double getAbsorptionAmount()`
- `void setAbsorptionAmount(double amount)`
- `@Deprecated(since="1.11") double getMaxHealth()`
- `@Deprecated(since="1.11") void setMaxHealth(double health)`
- `@Deprecated(since="1.11") void resetMaxHealth()`
