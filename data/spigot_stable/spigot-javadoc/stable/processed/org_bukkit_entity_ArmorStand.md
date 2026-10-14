---
title: "org.bukkit.entity.ArmorStand"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/ArmorStand.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface ArmorStand**
`public interface ArmorStand extends LivingEntity`
- `@NotNull @Deprecated(since="1.15.2") ItemStack getItemInHand()`
- `@Deprecated(since="1.15.2") void setItemInHand(@Nullable ItemStack item)`
- `@NotNull @Deprecated(since="1.15.2") ItemStack getBoots()`
- `@Deprecated(since="1.15.2") void setBoots(@Nullable ItemStack item)`
- `@NotNull @Deprecated(since="1.15.2") ItemStack getLeggings()`
- `@Deprecated(since="1.15.2") void setLeggings(@Nullable ItemStack item)`
- `@NotNull @Deprecated(since="1.15.2") ItemStack getChestplate()`
- `@Deprecated(since="1.15.2") void setChestplate(@Nullable ItemStack item)`
- `@NotNull @Deprecated(since="1.15.2") ItemStack getHelmet()`
- `@Deprecated(since="1.15.2") void setHelmet(@Nullable ItemStack item)`
- `@NotNull EulerAngle getBodyPose()`
- `void setBodyPose(@NotNull EulerAngle pose)`
- `@NotNull EulerAngle getLeftArmPose()`
- `void setLeftArmPose(@NotNull EulerAngle pose)`
- `@NotNull EulerAngle getRightArmPose()`
- `void setRightArmPose(@NotNull EulerAngle pose)`
- `@NotNull EulerAngle getLeftLegPose()`
- `void setLeftLegPose(@NotNull EulerAngle pose)`
- `@NotNull EulerAngle getRightLegPose()`
- `void setRightLegPose(@NotNull EulerAngle pose)`
- `@NotNull EulerAngle getHeadPose()`
- `void setHeadPose(@NotNull EulerAngle pose)`
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
- `void addEquipmentLock(@NotNull EquipmentSlot slot, @NotNull ArmorStand.LockType lockType)`
- `void removeEquipmentLock(@NotNull EquipmentSlot slot, @NotNull ArmorStand.LockType lockType)`
- `boolean hasEquipmentLock(@NotNull EquipmentSlot slot, @NotNull ArmorStand.LockType lockType)`
