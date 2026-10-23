---
title: "org.bukkit.event.block.CauldronLevelChangeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/block/CauldronLevelChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `public CauldronLevelChangeEvent(@NotNull @NotNull Block block, @Nullable @Nullable Entity entity, @NotNull @NotNull CauldronLevelChangeEvent.ChangeReason reason, @NotNull @NotNull BlockState newBlock)`
- `@Nullable public @Nullable Entity getEntity()`
- `@NotNull public @NotNull CauldronLevelChangeEvent.ChangeReason getReason()`
- `@NotNull public @NotNull BlockState getNewState()`
- `@Deprecated public int getOldLevel()`
- `@Deprecated public int getNewLevel()`
- `@Deprecated public void setNewLevel(int newLevel)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
