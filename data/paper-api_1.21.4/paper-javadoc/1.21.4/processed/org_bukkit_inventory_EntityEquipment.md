---
title: "org.bukkit.inventory.EntityEquipment"
package: "org.bukkit.inventory"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/inventory/EntityEquipment.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `void setItem(@NotNull @NotNull EquipmentSlot slot, @Nullable @Nullable ItemStack item)`
- `void setItem(@NotNull @NotNull EquipmentSlot slot, @Nullable @Nullable ItemStack item, boolean silent)`
- `@NotNull @NotNull ItemStack getItem(@NotNull @NotNull EquipmentSlot slot)`
- `@NotNull @NotNull ItemStack getItemInMainHand()`
- `void setItemInMainHand(@Nullable @Nullable ItemStack item)`
- `void setItemInMainHand(@Nullable @Nullable ItemStack item, boolean silent)`
- `@NotNull @NotNull ItemStack getItemInOffHand()`
- `void setItemInOffHand(@Nullable @Nullable ItemStack item)`
- `void setItemInOffHand(@Nullable @Nullable ItemStack item, boolean silent)`
- `@Deprecated(since="1.9") @NotNull @NotNull ItemStack getItemInHand()`
- `@Deprecated(since="1.9") void setItemInHand(@Nullable @Nullable ItemStack stack)`
- `@UndefinedNullability("not null for entities, nullable for players") ItemStack getHelmet()`
- `void setHelmet(@Nullable @Nullable ItemStack helmet)`
- `void setHelmet(@Nullable @Nullable ItemStack helmet, boolean silent)`
- `@UndefinedNullability("not null for entities, nullable for players") ItemStack getChestplate()`
- `void setChestplate(@Nullable @Nullable ItemStack chestplate)`
- `void setChestplate(@Nullable @Nullable ItemStack chestplate, boolean silent)`
- `@UndefinedNullability("not null for entities, nullable for players") ItemStack getLeggings()`
- `void setLeggings(@Nullable @Nullable ItemStack leggings)`
- `void setLeggings(@Nullable @Nullable ItemStack leggings, boolean silent)`
- `@UndefinedNullability("not null for entities, nullable for players") ItemStack getBoots()`
- `void setBoots(@Nullable @Nullable ItemStack boots)`
- `void setBoots(@Nullable @Nullable ItemStack boots, boolean silent)`
- `@UndefinedNullability("not null elements for entities, nullable elements for players") ItemStack @NotNull [] getArmorContents()`
- `void setArmorContents(@NotNull @NotNull ItemStack @NotNull [] items)`
- `void clear()`
- `@Deprecated(since="1.9") float getItemInHandDropChance()`
- `@Deprecated(since="1.9") void setItemInHandDropChance(float chance)`
- `float getItemInMainHandDropChance()`
- `void setItemInMainHandDropChance(float chance)`
- `float getItemInOffHandDropChance()`
- `void setItemInOffHandDropChance(float chance)`
- `float getHelmetDropChance()`
- `void setHelmetDropChance(float chance)`
- `float getChestplateDropChance()`
- `void setChestplateDropChance(float chance)`
- `float getLeggingsDropChance()`
- `void setLeggingsDropChance(float chance)`
- `float getBootsDropChance()`
- `void setBootsDropChance(float chance)`
- `@NotNull @NotNull Entity getHolder()`
- `float getDropChance(@NotNull @NotNull EquipmentSlot slot)`
- `void setDropChance(@NotNull @NotNull EquipmentSlot slot, float chance)`
