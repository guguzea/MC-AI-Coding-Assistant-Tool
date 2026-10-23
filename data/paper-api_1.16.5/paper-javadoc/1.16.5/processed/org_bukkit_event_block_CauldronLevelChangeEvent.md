---
title: "org.bukkit.event.block.CauldronLevelChangeEvent"
package: "org.bukkit.event.block"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/event/block/CauldronLevelChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public CauldronLevelChangeEvent&#8203;(@NotNull @NotNull Block block, @Nullable @Nullable Entity entity, @NotNull @NotNull CauldronLevelChangeEvent.ChangeReason reason, int oldLevel, int newLevel)`
- `@Nullable public @Nullable Entity getEntity()`
- `@NotNull public @NotNull CauldronLevelChangeEvent.ChangeReason getReason()`
- `public int getOldLevel()`
- `public int getNewLevel()`
- `public void setNewLevel&#8203;(int newLevel)`
- `public boolean isCancelled()`
- `public void setCancelled&#8203;(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
