---
title: "org.bukkit.entity.Creeper"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Creeper.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
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
- `void ignite(@NotNull Entity entity)`
- `void ignite()`
- `@Nullable Entity getIgniter()`
