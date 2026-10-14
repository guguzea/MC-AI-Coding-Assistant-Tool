---
title: "org.bukkit.event.entity.ExpBottleEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/ExpBottleEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ExpBottleEvent**
`public class ExpBottleEvent extends ProjectileHitEvent`
- `@Deprecated(since="1.20.2") public ExpBottleEvent(@NotNull ThrownExpBottle bottle, int exp)`
- `public ExpBottleEvent(@NotNull ThrownExpBottle bottle, @Nullable Entity hitEntity, @Nullable Block hitBlock, @Nullable BlockFace hitFace, int exp)`
- `@NotNull public ThrownExpBottle getEntity()`
- `public boolean getShowEffect()`
- `public void setShowEffect(boolean showEffect)`
- `public int getExperience()`
- `public void setExperience(int exp)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
