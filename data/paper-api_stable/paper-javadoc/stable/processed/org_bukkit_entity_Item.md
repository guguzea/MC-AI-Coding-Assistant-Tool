---
title: "org.bukkit.entity.Item"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Item.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Item**
`public interface Item extends Entity, Frictional`
- `@NotNull @NotNull ItemStack getItemStack()`
- `void setItemStack(@NotNull @NotNull ItemStack stack)`
- `int getPickupDelay()`
- `void setPickupDelay(int delay)`
- `void setUnlimitedLifetime(boolean unlimited)`
- `boolean isUnlimitedLifetime()`
- `void setOwner(@Nullable @Nullable UUID owner)`
- `@Nullable @Nullable UUID getOwner()`
- `void setThrower(@Nullable @Nullable UUID uuid)`
- `@Nullable @Nullable UUID getThrower()`
- `boolean canMobPickup()`
- `void setCanMobPickup(boolean canMobPickup)`
- `boolean canPlayerPickup()`
- `void setCanPlayerPickup(boolean canPlayerPickup)`
- `boolean willAge()`
- `void setWillAge(boolean willAge)`
- `int getHealth()`
- `void setHealth(int health)`
