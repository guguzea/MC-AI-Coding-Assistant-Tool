---
title: "org.bukkit.inventory.PlayerInventory"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/PlayerInventory.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull ItemStack[] getArmorContents()`
- `@NotNull @NotNull ItemStack[] getExtraContents()`
- `@Nullable @Nullable ItemStack getHelmet()`
- `@Nullable @Nullable ItemStack getChestplate()`
- `@Nullable @Nullable ItemStack getLeggings()`
- `@Nullable @Nullable ItemStack getBoots()`
- `void setItem&#8203;(int index, @Nullable @Nullable ItemStack item)`
- `void setItem&#8203;(@NotNull @NotNull EquipmentSlot slot, @Nullable @Nullable ItemStack item)`
- `@Nullable @Nullable ItemStack getItem&#8203;(@NotNull @NotNull EquipmentSlot slot)`
- `void setArmorContents&#8203;(@Nullable @Nullable ItemStack[] items)`
- `void setExtraContents&#8203;(@Nullable @Nullable ItemStack[] items)`
- `void setHelmet&#8203;(@Nullable @Nullable ItemStack helmet)`
- `void setChestplate&#8203;(@Nullable @Nullable ItemStack chestplate)`
- `void setLeggings&#8203;(@Nullable @Nullable ItemStack leggings)`
- `void setBoots&#8203;(@Nullable @Nullable ItemStack boots)`
- `@NotNull @NotNull ItemStack getItemInMainHand()`
- `void setItemInMainHand&#8203;(@Nullable @Nullable ItemStack item)`
- `@NotNull @NotNull ItemStack getItemInOffHand()`
- `void setItemInOffHand&#8203;(@Nullable @Nullable ItemStack item)`
- `@Deprecated @NotNull @NotNull ItemStack getItemInHand()`
- `@Deprecated void setItemInHand&#8203;(@Nullable @Nullable ItemStack stack)`
- `int getHeldItemSlot()`
- `void setHeldItemSlot&#8203;(int slot)`
- `@Nullable @Nullable HumanEntity getHolder()`
