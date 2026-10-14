---
title: "org.bukkit.event.entity.CreeperPowerEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/entity/CreeperPowerEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class CreeperPowerEvent**
`public class CreeperPowerEvent extends EntityEvent implements Cancellable`
- `@Internal public CreeperPowerEvent(@NotNull @NotNull Creeper creeper, @NotNull @NotNull LightningStrike bolt, @NotNull @NotNull CreeperPowerEvent.PowerCause cause)`
- `@Internal public CreeperPowerEvent(@NotNull @NotNull Creeper creeper, @NotNull @NotNull CreeperPowerEvent.PowerCause cause)`
- `@NotNull public @NotNull Creeper getEntity()`
- `@Nullable public @Nullable LightningStrike getLightning()`
- `@NotNull public @NotNull CreeperPowerEvent.PowerCause getCause()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
