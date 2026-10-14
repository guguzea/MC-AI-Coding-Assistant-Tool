---
title: "org.bukkit.entity.minecart.ExplosiveMinecart"
package: "org.bukkit.entity.minecart"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/minecart/ExplosiveMinecart.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ExplosiveMinecart**
`public interface ExplosiveMinecart extends Minecart, Explosive`
- `void setFuseTicks(int ticks)`
- `int getFuseTicks()`
- `float getExplosionSpeedFactor()`
- `void setExplosionSpeedFactor(float factor)`
- `void ignite()`
- `boolean isIgnited()`
- `void explode()`
- `void explode(double power)`
