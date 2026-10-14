---
title: "org.bukkit.entity.FallingBlock"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/FallingBlock.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface FallingBlock**
`public interface FallingBlock extends Entity`
- `@Deprecated(since="1.6.2") @NotNull Material getMaterial()`
- `@NotNull BlockData getBlockData()`
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
