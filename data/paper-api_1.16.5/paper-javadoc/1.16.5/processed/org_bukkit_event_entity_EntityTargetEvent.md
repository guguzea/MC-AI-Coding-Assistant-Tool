---
title: "org.bukkit.event.entity.EntityTargetEvent"
package: "org.bukkit.event.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/entity/EntityTargetEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public EntityTargetEvent&#8203;(@NotNull @NotNull Entity entity, @Nullable @Nullable Entity target, @NotNull @NotNull EntityTargetEvent.TargetReason reason)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancel)`
- `@NotNull public @NotNull EntityTargetEvent.TargetReason getReason()`
- `@Nullable public @Nullable Entity getTarget()`
- `public void setTarget&#8203;(@Nullable @Nullable Entity target)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
