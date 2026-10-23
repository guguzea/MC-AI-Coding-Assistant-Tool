---
title: "org.bukkit.event.entity.CreeperPowerEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/CreeperPowerEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public CreeperPowerEvent(@NotNull @NotNull Creeper creeper, @NotNull @NotNull LightningStrike bolt, @NotNull @NotNull CreeperPowerEvent.PowerCause cause)`
- `public CreeperPowerEvent(@NotNull @NotNull Creeper creeper, @NotNull @NotNull CreeperPowerEvent.PowerCause cause)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull Creeper getEntity()`
- `@Nullable public @Nullable LightningStrike getLightning()`
- `@NotNull public @NotNull CreeperPowerEvent.PowerCause getCause()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
