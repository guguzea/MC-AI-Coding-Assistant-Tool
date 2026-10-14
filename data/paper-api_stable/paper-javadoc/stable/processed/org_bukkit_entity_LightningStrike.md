---
title: "org.bukkit.entity.LightningStrike"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/LightningStrike.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface LightningStrike**
`public interface LightningStrike extends Entity`
- `boolean isEffect()`
- `@Deprecated int getFlashes()`
- `@Deprecated void setFlashes(int flashes)`
- `int getLifeTicks()`
- `void setLifeTicks(int ticks)`
- `@Nullable @Nullable Player getCausingPlayer()`
- `void setCausingPlayer(@Nullable @Nullable Player player)`
- `@NotNull @Deprecated(forRemoval=true) @NotNull LightningStrike.Spigot spigot()`
- `int getFlashCount()`
- `void setFlashCount(int flashes)`
- `@Nullable @Nullable Entity getCausingEntity()`
