---
title: "org.bukkit.entity.SulfurCube"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/SulfurCube.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface SulfurCube**
`@NullMarked public interface SulfurCube extends AbstractCubeMob, Shearable, Bucketable, Ageable`
- `int getFuseTicks()`
- `void setFuseTicks(int ticks)`
- `boolean canExplode()`
- `boolean ignite(boolean imminent)`
- `default boolean ignite()`
- `boolean swallow(ItemStack itemStack)`
- `default void setEquipped(ItemStack itemStack)`
- `default ItemStack getEquipped()`
