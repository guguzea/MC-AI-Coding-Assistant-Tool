---
title: "org.bukkit.event.block.CauldronLevelChangeEvent"
package: "org.bukkit.event.block"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/block/CauldronLevelChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class CauldronLevelChangeEvent**
`public class CauldronLevelChangeEvent extends BlockEvent implements Cancellable`
- `public CauldronLevelChangeEvent(@NotNull Block block, @Nullable Entity entity, @NotNull CauldronLevelChangeEvent.ChangeReason reason, @NotNull BlockState newBlock)`
- `@Nullable public Entity getEntity()`
- `@NotNull public CauldronLevelChangeEvent.ChangeReason getReason()`
- `@NotNull public BlockState getNewState()`
- `@Deprecated(since="1.17") public int getOldLevel()`
- `@Deprecated(since="1.17") public int getNewLevel()`
- `@Deprecated(since="1.17") public void setNewLevel(int newLevel)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
