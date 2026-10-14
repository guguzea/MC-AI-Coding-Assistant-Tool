---
title: "org.bukkit.entity.FallingBlock"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/FallingBlock.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface FallingBlock**
`public interface FallingBlock extends Entity`
- `@Deprecated(since="1.6.2") @NotNull @NotNull Material getMaterial()`
- `@NotNull @NotNull BlockData getBlockData()`
- `void setBlockData(@NotNull @NotNull BlockData blockData)`
- `@NotNull BlockState getBlockState()`
- `void setBlockState(@NotNull BlockState blockState)`
- `boolean getDropItem()`
- `void setDropItem(boolean drop)`
- `boolean getCancelDrop()`
- `void setCancelDrop(boolean cancelDrop)`
- `boolean canHurtEntities()`
- `void setHurtEntities(boolean hurtEntities)`
- `float getDamagePerBlock()`
- `void setDamagePerBlock(float damage)`
- `int getMaxDamage()`
- `void setMaxDamage(int damage)`
- `@Deprecated default Location getSourceLoc()`
- `boolean doesAutoExpire()`
- `void shouldAutoExpire(boolean autoExpires)`
