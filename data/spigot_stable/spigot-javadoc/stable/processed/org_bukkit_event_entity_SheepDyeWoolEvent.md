---
title: "org.bukkit.event.entity.SheepDyeWoolEvent"
package: "org.bukkit.event.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/SheepDyeWoolEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class SheepDyeWoolEvent**
`public class SheepDyeWoolEvent extends EntityEvent implements Cancellable`
- `@Deprecated(since="1.17.1") public SheepDyeWoolEvent(@NotNull Sheep sheep, @NotNull DyeColor color)`
- `public SheepDyeWoolEvent(@NotNull Sheep sheep, @NotNull DyeColor color, @Nullable Player player)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public Sheep getEntity()`
- `@Nullable public Player getPlayer()`
- `@NotNull public DyeColor getColor()`
- `public void setColor(@NotNull DyeColor color)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
