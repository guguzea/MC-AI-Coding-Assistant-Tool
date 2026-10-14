---
title: "org.bukkit.event.player.PlayerArmorStandManipulateEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerArmorStandManipulateEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerArmorStandManipulateEvent**
`public class PlayerArmorStandManipulateEvent extends PlayerInteractEntityEvent`
- `@Internal public PlayerArmorStandManipulateEvent(@NotNull @NotNull Player player, @NotNull @NotNull ArmorStand clickedEntity, @NotNull @NotNull ItemStack playerItem, @NotNull @NotNull ItemStack armorStandItem, @NotNull @NotNull EquipmentSlot slot, @NotNull @NotNull EquipmentSlot hand)`
- `@Deprecated(since="1.19.2", forRemoval=true) public PlayerArmorStandManipulateEvent(@NotNull @NotNull Player player, @NotNull @NotNull ArmorStand clickedEntity, @NotNull @NotNull ItemStack playerItem, @NotNull @NotNull ItemStack armorStandItem, @NotNull @NotNull EquipmentSlot slot)`
- `@NotNull public @NotNull ItemStack getPlayerItem()`
- `@NotNull public @NotNull ItemStack getArmorStandItem()`
- `@NotNull public @NotNull EquipmentSlot getSlot()`
- `@NotNull public @NotNull EquipmentSlot getHand()`
- `@NotNull public @NotNull ArmorStand getRightClicked()`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
