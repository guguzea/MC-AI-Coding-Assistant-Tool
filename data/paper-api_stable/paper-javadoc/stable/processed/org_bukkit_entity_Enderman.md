---
title: "org.bukkit.entity.Enderman"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Enderman.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Enderman**
`public interface Enderman extends Monster`
- `boolean teleportRandomly()`
- `@NotNull @Deprecated(forRemoval=true, since="1.13") @NotNull MaterialData getCarriedMaterial()`
- `@Deprecated(forRemoval=true, since="1.13") void setCarriedMaterial(@NotNull @NotNull MaterialData material)`
- `@Nullable @Nullable BlockData getCarriedBlock()`
- `void setCarriedBlock(@Nullable @Nullable BlockData blockData)`
- `boolean teleport()`
- `boolean teleportTowards(@NotNull @NotNull Entity entity)`
- `boolean isScreaming()`
- `void setScreaming(boolean screaming)`
- `boolean hasBeenStaredAt()`
- `void setHasBeenStaredAt(boolean hasBeenStaredAt)`
