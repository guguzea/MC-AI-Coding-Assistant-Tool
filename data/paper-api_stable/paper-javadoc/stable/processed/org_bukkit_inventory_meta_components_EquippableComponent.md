---
title: "org.bukkit.inventory.meta.components.EquippableComponent"
package: "org.bukkit.inventory.meta.components"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/components/EquippableComponent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface EquippableComponent**
`@Experimental public interface EquippableComponent extends ConfigurationSerializable`
- `@NotNull @NotNull EquipmentSlot getSlot()`
- `void setSlot(@NotNull @NotNull EquipmentSlot slot)`
- `@NotNull @NotNull Sound getEquipSound()`
- `void setEquipSound(@Nullable @Nullable Sound sound)`
- `@Nullable @Nullable NamespacedKey getModel()`
- `void setModel(@Nullable @Nullable NamespacedKey key)`
- `@Nullable @Nullable NamespacedKey getCameraOverlay()`
- `void setCameraOverlay(@Nullable @Nullable NamespacedKey key)`
- `@Nullable @Nullable Collection<EntityType> getAllowedEntities()`
- `void setAllowedEntities(@Nullable @Nullable EntityType entities)`
- `void setAllowedEntities(@Nullable @Nullable Collection<EntityType> entities)`
- `void setAllowedEntities(@Nullable @Nullable Tag<EntityType> tag)`
- `boolean isDispensable()`
- `void setDispensable(boolean dispensable)`
- `boolean isSwappable()`
- `void setSwappable(boolean swappable)`
- `boolean isDamageOnHurt()`
- `void setDamageOnHurt(boolean damage)`
- `boolean isEquipOnInteract()`
- `void setEquipOnInteract(boolean equip)`
- `boolean canBeSheared()`
- `void setCanBeSheared(boolean sheared)`
- `@Nullable @Nullable Sound getShearingSound()`
- `void setShearingSound(@Nullable @Nullable Sound sound)`
