---
title: "org.bukkit.entity.Minecart"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Minecart.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Minecart**
`public interface Minecart extends Vehicle, Frictional`
- `void setDamage(double damage)`
- `double getDamage()`
- `double getMaxSpeed()`
- `void setMaxSpeed(double speed)`
- `boolean isSlowWhenEmpty()`
- `void setSlowWhenEmpty(boolean slow)`
- `@NotNull @NotNull Vector getFlyingVelocityMod()`
- `void setFlyingVelocityMod(@NotNull @NotNull Vector flying)`
- `@NotNull @NotNull Vector getDerailedVelocityMod()`
- `void setDerailedVelocityMod(@NotNull @NotNull Vector derailed)`
- `@Deprecated(forRemoval=true, since="1.13") void setDisplayBlock(@Nullable @Nullable MaterialData material)`
- `@NotNull @Deprecated(forRemoval=true, since="1.13") @NotNull MaterialData getDisplayBlock()`
- `void setDisplayBlockData(@Nullable @Nullable BlockData blockData)`
- `@NotNull @NotNull BlockData getDisplayBlockData()`
- `void setDisplayBlockOffset(int offset)`
- `int getDisplayBlockOffset()`
- `@NotNull @NotNull Material getMinecartMaterial()`
