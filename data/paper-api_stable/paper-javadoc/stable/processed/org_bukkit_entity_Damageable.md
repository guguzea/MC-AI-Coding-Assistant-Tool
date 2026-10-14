---
title: "org.bukkit.entity.Damageable"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Damageable.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Damageable**
`@NullMarked public interface Damageable extends Entity`
- `void damage(double amount)`
- `void damage(double amount, @Nullable Entity source)`
- `void damage(double amount, DamageSource damageSource)`
- `default void kill()`
- `void kill(DamageSource damageSource)`
- `double getHealth()`
- `void setHealth(double health)`
- `default void heal(double amount)`
- `void heal(double amount, EntityRegainHealthEvent.RegainReason reason)`
- `double getAbsorptionAmount()`
- `void setAbsorptionAmount(double amount)`
- `@Deprecated(since="1.11") double getMaxHealth()`
- `@Deprecated(since="1.11") void setMaxHealth(double health)`
- `@Deprecated(since="1.11") void resetMaxHealth()`
