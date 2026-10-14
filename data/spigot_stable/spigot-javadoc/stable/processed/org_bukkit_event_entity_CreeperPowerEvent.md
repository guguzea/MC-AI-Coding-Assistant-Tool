---
title: "org.bukkit.event.entity.CreeperPowerEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/CreeperPowerEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class CreeperPowerEvent**
`public class CreeperPowerEvent extends EntityEvent implements Cancellable`
- `public CreeperPowerEvent(@NotNull Creeper creeper, @NotNull LightningStrike bolt, @NotNull CreeperPowerEvent.PowerCause cause)`
- `public CreeperPowerEvent(@NotNull Creeper creeper, @NotNull CreeperPowerEvent.PowerCause cause)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Creeper getEntity()`
- `@Nullable public LightningStrike getLightning()`
- `@NotNull public CreeperPowerEvent.PowerCause getCause()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
