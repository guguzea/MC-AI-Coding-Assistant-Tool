---
title: "org.bukkit.entity.Warden"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Warden.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Warden**
`public interface Warden extends Monster`
- `int getAnger()`
- `int getAnger(@NotNull Entity entity)`
- `void increaseAnger(@NotNull Entity entity, int increase)`
- `void setAnger(@NotNull Entity entity, int anger)`
- `void clearAnger(@NotNull Entity entity)`
- `@Nullable LivingEntity getEntityAngryAt()`
- `void setDisturbanceLocation(@NotNull Location location)`
- `@NotNull Warden.AngerLevel getAngerLevel()`
