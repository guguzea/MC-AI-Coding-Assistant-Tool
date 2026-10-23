---
title: "org.bukkit.event.entity.EntityUnleashEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/EntityUnleashEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Deprecated public EntityUnleashEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull EntityUnleashEvent.UnleashReason reason)`
- `public EntityUnleashEvent(@NotNull @NotNull Entity entity, @NotNull @NotNull EntityUnleashEvent.UnleashReason reason, boolean dropLeash)`
- `@NotNull public @NotNull EntityUnleashEvent.UnleashReason getReason()`
- `public boolean isDropLeash()`
- `public void setDropLeash(boolean dropLeash)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
