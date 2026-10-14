---
title: "org.bukkit.entity.Warden"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Warden.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Warden**
`public interface Warden extends Monster`
- `int getAnger()`
- `int getAnger(@NotNull @NotNull Entity entity)`
- `int getHighestAnger()`
- `void increaseAnger(@NotNull @NotNull Entity entity, int increase)`
- `void setAnger(@NotNull @NotNull Entity entity, int anger)`
- `void clearAnger(@NotNull @NotNull Entity entity)`
- `@Nullable @Nullable LivingEntity getEntityAngryAt()`
- `void setDisturbanceLocation(@NotNull @NotNull Location location)`
- `@NotNull @NotNull Warden.AngerLevel getAngerLevel()`
