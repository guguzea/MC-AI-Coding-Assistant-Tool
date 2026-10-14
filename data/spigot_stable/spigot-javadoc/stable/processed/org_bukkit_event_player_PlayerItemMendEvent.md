---
title: "org.bukkit.event.player.PlayerItemMendEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerItemMendEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerItemMendEvent**
`public class PlayerItemMendEvent extends PlayerEvent implements Cancellable`
- `public PlayerItemMendEvent(@NotNull Player who, @NotNull ItemStack item, @NotNull EquipmentSlot slot, @NotNull ExperienceOrb experienceOrb, int repairAmount)`
- `@Deprecated(since="1.19.2") public PlayerItemMendEvent(@NotNull Player who, @NotNull ItemStack item, @NotNull ExperienceOrb experienceOrb, int repairAmount)`
- `@NotNull public ItemStack getItem()`
- `@NotNull public EquipmentSlot getSlot()`
- `@NotNull public ExperienceOrb getExperienceOrb()`
- `public int getRepairAmount()`
- `public void setRepairAmount(int amount)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
