---
title: "io.papermc.paper.event.player.PlayerNameEntityEvent"
package: "io.papermc.paper.event.player"
source: https://jd.papermc.io/paper/1.20.1/io/papermc/paper/event/player/PlayerNameEntityEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public PlayerNameEntityEvent(@NotNull @NotNull Player player, @NotNull @NotNull LivingEntity entity, @NotNull @NotNull Component name, boolean persistent)`
- `@Nullable public @Nullable Component getName()`
- `public void setName(@Nullable @Nullable Component name)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `public void setEntity(@NotNull @NotNull LivingEntity entity)`
- `public boolean isPersistent()`
- `public void setPersistent(boolean persistent)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
