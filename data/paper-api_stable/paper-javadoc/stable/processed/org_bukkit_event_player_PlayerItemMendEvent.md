---
title: "org.bukkit.event.player.PlayerItemMendEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerItemMendEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerItemMendEvent**
`public class PlayerItemMendEvent extends PlayerEvent implements Cancellable`
- `@Internal @Deprecated(forRemoval=true) public PlayerItemMendEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack item, @NotNull @NotNull EquipmentSlot slot, @NotNull @NotNull ExperienceOrb experienceOrb, int repairAmount)`
- `@Internal public PlayerItemMendEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack item, @NotNull @NotNull EquipmentSlot slot, @NotNull @NotNull ExperienceOrb experienceOrb, int repairAmount, int consumedExperience)`
- `@Deprecated(since="1.19.2", forRemoval=true) public PlayerItemMendEvent(@NotNull @NotNull Player player, @NotNull @NotNull ItemStack item, @NotNull @NotNull ExperienceOrb experienceOrb, int repairAmount)`
- `@NotNull public @NotNull ItemStack getItem()`
- `@NotNull public @NotNull EquipmentSlot getSlot()`
- `@NotNull public @NotNull ExperienceOrb getExperienceOrb()`
- `public int getRepairAmount()`
- `public void setRepairAmount(int amount)`
- `public int getConsumedExperience()`
- `@Contract("-> fail") @Deprecated(forRemoval=true, since="1.21") @NotNull public IntUnaryOperator getDurabilityToXpOperation()`
- `@Contract("_ -> fail") @Deprecated(forRemoval=true, since="1.21") public void setDurabilityToXpOperation(@NotNull IntUnaryOperator durabilityToXpOp)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
