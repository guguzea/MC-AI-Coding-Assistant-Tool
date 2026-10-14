---
title: "org.bukkit.entity.Damageable"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Damageable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Damageable**
`public interface Damageable extends Entity`
- `void damage(double amount)`
- `void damage(double amount, @Nullable Entity source)`
- `void damage(double amount, @NotNull DamageSource damageSource)`
- `double getHealth()`
- `void setHealth(double health)`
- `double getAbsorptionAmount()`
- `void setAbsorptionAmount(double amount)`
- `@Deprecated(since="1.11") double getMaxHealth()`
- `@Deprecated(since="1.11") void setMaxHealth(double health)`
- `@Deprecated(since="1.11") void resetMaxHealth()`
