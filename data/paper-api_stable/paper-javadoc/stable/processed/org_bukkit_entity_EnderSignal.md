---
title: "org.bukkit.entity.EnderSignal"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/EnderSignal.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface EnderSignal**
`public interface EnderSignal extends Entity`
- `@Nullable @Nullable Location getTargetLocation()`
- `void setTargetLocation(@NotNull @NotNull Location location)`
- `void setTargetLocation(@NotNull @NotNull Location location, boolean update)`
- `boolean getDropItem()`
- `void setDropItem(boolean drop)`
- `@NotNull @NotNull ItemStack getItem()`
- `void setItem(@Nullable @Nullable ItemStack item)`
- `int getDespawnTimer()`
- `void setDespawnTimer(int timer)`
