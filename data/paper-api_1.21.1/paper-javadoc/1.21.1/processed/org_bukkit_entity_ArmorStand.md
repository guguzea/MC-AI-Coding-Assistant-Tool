---
title: "org.bukkit.entity.ArmorStand"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/entity/ArmorStand.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@NotNull @Deprecated @NotNull ItemStack getItemInHand()`
- `@Deprecated void setItemInHand(@Nullable @Nullable ItemStack item)`
- `@NotNull @Deprecated @NotNull ItemStack getBoots()`
- `@Deprecated void setBoots(@Nullable @Nullable ItemStack item)`
- `@NotNull @Deprecated @NotNull ItemStack getLeggings()`
- `@Deprecated void setLeggings(@Nullable @Nullable ItemStack item)`
- `@NotNull @Deprecated @NotNull ItemStack getChestplate()`
- `@Deprecated void setChestplate(@Nullable @Nullable ItemStack item)`
- `@NotNull @Deprecated @NotNull ItemStack getHelmet()`
- `@Deprecated void setHelmet(@Nullable @Nullable ItemStack item)`
- `@NotNull @NotNull EulerAngle getBodyPose()`
- `void setBodyPose(@NotNull @NotNull EulerAngle pose)`
- `@NotNull @NotNull EulerAngle getLeftArmPose()`
- `void setLeftArmPose(@NotNull @NotNull EulerAngle pose)`
- `@NotNull @NotNull EulerAngle getRightArmPose()`
- `void setRightArmPose(@NotNull @NotNull EulerAngle pose)`
- `@NotNull @NotNull EulerAngle getLeftLegPose()`
- `void setLeftLegPose(@NotNull @NotNull EulerAngle pose)`
- `@NotNull @NotNull EulerAngle getRightLegPose()`
- `void setRightLegPose(@NotNull @NotNull EulerAngle pose)`
- `@NotNull @NotNull EulerAngle getHeadPose()`
- `void setHeadPose(@NotNull @NotNull EulerAngle pose)`
- `boolean hasBasePlate()`
- `void setBasePlate(boolean basePlate)`
- `boolean isVisible()`
- `void setVisible(boolean visible)`
- `boolean hasArms()`
- `void setArms(boolean arms)`
- `boolean isSmall()`
- `void setSmall(boolean small)`
- `boolean isMarker()`
- `void setMarker(boolean marker)`
- `void addEquipmentLock(@NotNull @NotNull EquipmentSlot slot, @NotNull @NotNull ArmorStand.LockType lockType)`
- `void removeEquipmentLock(@NotNull @NotNull EquipmentSlot slot, @NotNull @NotNull ArmorStand.LockType lockType)`
- `boolean hasEquipmentLock(@NotNull @NotNull EquipmentSlot slot, @NotNull @NotNull ArmorStand.LockType lockType)`
- `boolean canMove()`
- `void setCanMove(boolean move)`
- `@NotNull EntityEquipment getEquipment()`
- `boolean canTick()`
- `void setCanTick(boolean tick)`
- `@NotNull @NotNull ItemStack getItem(@NotNull EquipmentSlot slot)`
- `void setItem(@NotNull EquipmentSlot slot, @Nullable @Nullable ItemStack item)`
- `@NotNull Set<EquipmentSlot> getDisabledSlots()`
- `void setDisabledSlots(@NotNull EquipmentSlot... slots)`
- `void addDisabledSlots(@NotNull EquipmentSlot... slots)`
- `void removeDisabledSlots(@NotNull EquipmentSlot... slots)`
- `boolean isSlotDisabled(@NotNull EquipmentSlot slot)`
- `@NotNull Rotations getBodyRotations()`
- `void setBodyRotations(@NotNull Rotations rotations)`
- `@NotNull Rotations getLeftArmRotations()`
- `void setLeftArmRotations(@NotNull Rotations rotations)`
- `@NotNull Rotations getRightArmRotations()`
- `void setRightArmRotations(@NotNull Rotations rotations)`
- `@NotNull Rotations getLeftLegRotations()`
- `void setLeftLegRotations(@NotNull Rotations rotations)`
- `@NotNull Rotations getRightLegRotations()`
- `void setRightLegRotations(@NotNull Rotations rotations)`
- `@NotNull Rotations getHeadRotations()`
- `void setHeadRotations(@NotNull Rotations rotations)`
