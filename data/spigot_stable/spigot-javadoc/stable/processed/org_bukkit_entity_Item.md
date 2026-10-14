---
title: "org.bukkit.entity.Item"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Item.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Item**
`public interface Item extends Entity`
- `@NotNull ItemStack getItemStack()`
- `void setItemStack(@NotNull ItemStack stack)`
- `int getPickupDelay()`
- `void setPickupDelay(int delay)`
- `void setUnlimitedLifetime(boolean unlimited)`
- `boolean isUnlimitedLifetime()`
- `void setOwner(@Nullable UUID owner)`
- `@Nullable UUID getOwner()`
- `void setThrower(@Nullable UUID uuid)`
- `@Nullable UUID getThrower()`
