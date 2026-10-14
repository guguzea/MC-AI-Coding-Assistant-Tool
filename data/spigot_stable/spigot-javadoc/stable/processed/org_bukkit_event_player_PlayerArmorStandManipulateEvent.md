---
title: "org.bukkit.event.player.PlayerArmorStandManipulateEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerArmorStandManipulateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerArmorStandManipulateEvent**
`public class PlayerArmorStandManipulateEvent extends PlayerInteractEntityEvent`
- `public PlayerArmorStandManipulateEvent(@NotNull Player who, @NotNull ArmorStand clickedEntity, @NotNull ItemStack playerItem, @NotNull ItemStack armorStandItem, @NotNull EquipmentSlot slot, @NotNull EquipmentSlot hand)`
- `@Deprecated(since="1.19.2") public PlayerArmorStandManipulateEvent(@NotNull Player who, @NotNull ArmorStand clickedEntity, @NotNull ItemStack playerItem, @NotNull ItemStack armorStandItem, @NotNull EquipmentSlot slot)`
- `@NotNull public ItemStack getPlayerItem()`
- `@NotNull public ItemStack getArmorStandItem()`
- `@NotNull public EquipmentSlot getSlot()`
- `@NotNull public EquipmentSlot getHand()`
- `@NotNull public ArmorStand getRightClicked()`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
