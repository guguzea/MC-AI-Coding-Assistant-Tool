---
title: "org.bukkit.event.player.PlayerItemConsumeEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerItemConsumeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerItemConsumeEvent**
`public class PlayerItemConsumeEvent extends PlayerEvent implements Cancellable`
- `@Internal public PlayerItemConsumeEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack item, @NotNull @NotNull EquipmentSlot hand)`
- `@Internal @Deprecated(since="1.19.2", forRemoval=true) public PlayerItemConsumeEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack item)`
- `@NotNull public @NotNull ItemStack getItem()`
- `public void setItem(@Nullable @Nullable ItemStack item)`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `@Nullable public @Nullable ItemStack getReplacement()`
- `public void setReplacement(@Nullable @Nullable ItemStack replacement)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancel)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
