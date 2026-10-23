---
title: "org.bukkit.entity.ArmorStand"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/entity/ArmorStand.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@NotNull @Deprecated @NotNull ItemStack getItemInHand()`
- `@Deprecated void setItemInHand&#8203;(@Nullable @Nullable ItemStack item)`
- `@NotNull @Deprecated @NotNull ItemStack getBoots()`
- `@Deprecated void setBoots&#8203;(@Nullable @Nullable ItemStack item)`
- `@NotNull @Deprecated @NotNull ItemStack getLeggings()`
- `@Deprecated void setLeggings&#8203;(@Nullable @Nullable ItemStack item)`
- `@NotNull @Deprecated @NotNull ItemStack getChestplate()`
- `@Deprecated void setChestplate&#8203;(@Nullable @Nullable ItemStack item)`
- `@NotNull @Deprecated @NotNull ItemStack getHelmet()`
- `@Deprecated void setHelmet&#8203;(@Nullable @Nullable ItemStack item)`
- `@NotNull @NotNull EulerAngle getBodyPose()`
- `void setBodyPose&#8203;(@NotNull @NotNull EulerAngle pose)`
- `@NotNull @NotNull EulerAngle getLeftArmPose()`
- `void setLeftArmPose&#8203;(@NotNull @NotNull EulerAngle pose)`
- `@NotNull @NotNull EulerAngle getRightArmPose()`
- `void setRightArmPose&#8203;(@NotNull @NotNull EulerAngle pose)`
- `@NotNull @NotNull EulerAngle getLeftLegPose()`
- `void setLeftLegPose&#8203;(@NotNull @NotNull EulerAngle pose)`
- `@NotNull @NotNull EulerAngle getRightLegPose()`
- `void setRightLegPose&#8203;(@NotNull @NotNull EulerAngle pose)`
- `@NotNull @NotNull EulerAngle getHeadPose()`
- `void setHeadPose&#8203;(@NotNull @NotNull EulerAngle pose)`
- `boolean hasBasePlate()`
- `void setBasePlate&#8203;(boolean basePlate)`
- `boolean isVisible()`
- `void setVisible&#8203;(boolean visible)`
- `boolean hasArms()`
- `void setArms&#8203;(boolean arms)`
- `boolean isSmall()`
- `void setSmall&#8203;(boolean small)`
- `boolean isMarker()`
- `void setMarker&#8203;(boolean marker)`
- `void addEquipmentLock&#8203;(@NotNull @NotNull EquipmentSlot slot, @NotNull @NotNull ArmorStand.LockType lockType)`
- `void removeEquipmentLock&#8203;(@NotNull @NotNull EquipmentSlot slot, @NotNull @NotNull ArmorStand.LockType lockType)`
- `boolean hasEquipmentLock&#8203;(@NotNull @NotNull EquipmentSlot slot, @NotNull @NotNull ArmorStand.LockType lockType)`
- `boolean canMove()`
- `void setCanMove&#8203;(boolean move)`
- `boolean canTick()`
- `void setCanTick&#8203;(boolean tick)`
- `@NotNull @NotNull ItemStack getItem&#8203;(@NotNull EquipmentSlot slot)`
- `void setItem&#8203;(@NotNull EquipmentSlot slot, @Nullable @Nullable ItemStack item)`
- `@NotNull Set<EquipmentSlot> getDisabledSlots()`
- `void setDisabledSlots&#8203;(@NotNull @NotNull EquipmentSlot... slots)`
- `void addDisabledSlots&#8203;(@NotNull @NotNull EquipmentSlot... slots)`
- `void removeDisabledSlots&#8203;(@NotNull @NotNull EquipmentSlot... slots)`
- `boolean isSlotDisabled&#8203;(@NotNull EquipmentSlot slot)`
