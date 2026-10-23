---
title: "org.bukkit.event.entity.EntityCreatePortalEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/event/entity/EntityCreatePortalEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `public EntityCreatePortalEvent(@NotNull @NotNull LivingEntity what, @NotNull @NotNull List<BlockState> blocks, @NotNull @NotNull PortalType type)`
- `@NotNull public @NotNull LivingEntity getEntity()`
- `@NotNull public @NotNull List<BlockState> getBlocks()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull PortalType getPortalType()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
