---
title: "org.bukkit.entity.Minecart"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Minecart.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Minecart**
`public interface Minecart extends Vehicle`
- `void setDamage(double damage)`
- `double getDamage()`
- `double getMaxSpeed()`
- `void setMaxSpeed(double speed)`
- `boolean isSlowWhenEmpty()`
- `void setSlowWhenEmpty(boolean slow)`
- `@NotNull Vector getFlyingVelocityMod()`
- `void setFlyingVelocityMod(@NotNull Vector flying)`
- `@NotNull Vector getDerailedVelocityMod()`
- `void setDerailedVelocityMod(@NotNull Vector derailed)`
- `void setDisplayBlock(@Nullable MaterialData material)`
- `@NotNull MaterialData getDisplayBlock()`
- `void setDisplayBlockData(@Nullable BlockData blockData)`
- `@NotNull BlockData getDisplayBlockData()`
- `void setDisplayBlockOffset(int offset)`
- `int getDisplayBlockOffset()`
- `void setPoweredRailAccelerationMultiplier(double multiplier)`
- `double getPoweredRailAccelerationMultiplier()`
