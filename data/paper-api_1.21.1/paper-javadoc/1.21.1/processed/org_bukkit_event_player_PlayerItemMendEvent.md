---
title: "org.bukkit.event.player.PlayerItemMendEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/event/player/PlayerItemMendEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated public PlayerItemMendEvent(@NotNull @NotNull Player who, @NotNull @NotNull ItemStack item, @NotNull @NotNull EquipmentSlot slot, @NotNull @NotNull ExperienceOrb experienceOrb, int repairAmount)`
- `@Internal public PlayerItemMendEvent(@NotNull @NotNull Player who, @NotNull @NotNull ItemStack item, @NotNull @NotNull EquipmentSlot slot, @NotNull @NotNull ExperienceOrb experienceOrb, int repairAmount, int consumedExperience)`
- `@Deprecated public PlayerItemMendEvent(@NotNull @NotNull Player who, @NotNull @NotNull ItemStack item, @NotNull @NotNull ExperienceOrb experienceOrb, int repairAmount)`
- `@Contract("-> fail") @Deprecated(forRemoval=true, since="1.21") @NotNull public IntUnaryOperator getDurabilityToXpOperation()`
- `@Contract("_ -> fail") @Deprecated(forRemoval=true, since="1.21") public void setDurabilityToXpOperation(@NotNull IntUnaryOperator durabilityToXpOp)`
- `public int getConsumedExperience()`
- `@NotNull public @NotNull ItemStack getItem()`
- `@NotNull public @NotNull EquipmentSlot getSlot()`
- `@NotNull public @NotNull ExperienceOrb getExperienceOrb()`
- `public int getRepairAmount()`
- `public void setRepairAmount(int amount)`
- `public boolean isCancelled()`
- `public void setCancelled(boolean cancelled)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
