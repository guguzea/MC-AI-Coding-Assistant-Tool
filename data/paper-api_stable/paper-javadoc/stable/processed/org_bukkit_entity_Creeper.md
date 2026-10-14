---
title: "org.bukkit.entity.Creeper"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Creeper.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Creeper**
`public interface Creeper extends Monster`
- `boolean isPowered()`
- `void setPowered(boolean value)`
- `void setMaxFuseTicks(int ticks)`
- `int getMaxFuseTicks()`
- `void setFuseTicks(int ticks)`
- `int getFuseTicks()`
- `void setExplosionRadius(int radius)`
- `int getExplosionRadius()`
- `void explode()`
- `void ignite(@NotNull @NotNull Entity entity)`
- `void ignite()`
- `@Nullable @Nullable Entity getIgniter()`
- `void setIgnited(boolean ignited)`
- `boolean isIgnited()`
