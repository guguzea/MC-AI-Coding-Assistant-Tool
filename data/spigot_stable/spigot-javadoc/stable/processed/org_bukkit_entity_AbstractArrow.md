---
title: "org.bukkit.entity.AbstractArrow"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/AbstractArrow.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface AbstractArrow**
`public interface AbstractArrow extends Projectile`
- `@Deprecated(since="1.21") int getKnockbackStrength()`
- `@Deprecated(since="1.21") void setKnockbackStrength(int knockbackStrength)`
- `double getDamage()`
- `void setDamage(double damage)`
- `int getPierceLevel()`
- `void setPierceLevel(int pierceLevel)`
- `boolean isCritical()`
- `void setCritical(boolean critical)`
- `boolean isInBlock()`
- `@Nullable Block getAttachedBlock()`
- `@NotNull AbstractArrow.PickupStatus getPickupStatus()`
- `void setPickupStatus(@NotNull AbstractArrow.PickupStatus status)`
- `boolean isShotFromCrossbow()`
- `@Deprecated(since="1.21") void setShotFromCrossbow(boolean shotFromCrossbow)`
- `@NotNull @Experimental ItemStack getItem()`
- `@Experimental void setItem(@NotNull ItemStack item)`
- `@NotNull @Experimental ItemStack getWeapon()`
- `@Experimental void setWeapon(@NotNull ItemStack item)`
