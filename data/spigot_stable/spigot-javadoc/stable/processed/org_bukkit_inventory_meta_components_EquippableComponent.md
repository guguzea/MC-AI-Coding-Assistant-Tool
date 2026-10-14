---
title: "org.bukkit.inventory.meta.components.EquippableComponent"
package: "org.bukkit.inventory.meta.components"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/components/EquippableComponent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface EquippableComponent**
`@Experimental public interface EquippableComponent extends ConfigurationSerializable`
- `@NotNull EquipmentSlot getSlot()`
- `void setSlot(@NotNull EquipmentSlot slot)`
- `@Nullable Sound getEquipSound()`
- `void setEquipSound(@Nullable Sound sound)`
- `@Nullable NamespacedKey getModel()`
- `void setModel(@Nullable NamespacedKey key)`
- `@Nullable NamespacedKey getCameraOverlay()`
- `void setCameraOverlay(@Nullable NamespacedKey key)`
- `@Nullable Collection<EntityType> getAllowedEntities()`
- `void setAllowedEntities(@Nullable EntityType entities)`
- `void setAllowedEntities(@Nullable Collection<EntityType> entities)`
- `void setAllowedEntities(@Nullable Tag<EntityType> tag)`
- `boolean isDispensable()`
- `void setDispensable(boolean dispensable)`
- `boolean isSwappable()`
- `void setSwappable(boolean swappable)`
- `boolean isDamageOnHurt()`
- `void setDamageOnHurt(boolean damage)`
- `boolean isEquipOnInteract()`
- `void setEquipOnInteract(boolean equip)`
- `boolean isCanBeSheared()`
- `void setCanBeSheared(boolean sheared)`
- `@Nullable Sound getShearingSound()`
- `void setShearingSound(@Nullable Sound sound)`
