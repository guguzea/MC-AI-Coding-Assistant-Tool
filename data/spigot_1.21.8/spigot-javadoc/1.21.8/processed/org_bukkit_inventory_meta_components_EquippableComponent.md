---
title: "org.bukkit.inventory.meta.components.EquippableComponent"
package: "org.bukkit.inventory.meta.components"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.inventory.meta.components.EquippableComponent extends org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public abstract org.bukkit.inventory.EquipmentSlot getSlot()`
- `public abstract void setSlot(org.bukkit.inventory.EquipmentSlot)`
- `public abstract org.bukkit.Sound getEquipSound()`
- `public abstract void setEquipSound(org.bukkit.Sound)`
- `public abstract org.bukkit.NamespacedKey getModel()`
- `public abstract void setModel(org.bukkit.NamespacedKey)`
- `public abstract org.bukkit.NamespacedKey getCameraOverlay()`
- `public abstract void setCameraOverlay(org.bukkit.NamespacedKey)`
- `public abstract java.util.Collection<org.bukkit.entity.EntityType> getAllowedEntities()`
- `public abstract void setAllowedEntities(org.bukkit.entity.EntityType)`
- `public abstract void setAllowedEntities(java.util.Collection<org.bukkit.entity.EntityType>)`
- `public abstract void setAllowedEntities(org.bukkit.Tag<org.bukkit.entity.EntityType>)`
- `public abstract boolean isDispensable()`
- `public abstract void setDispensable(boolean)`
- `public abstract boolean isSwappable()`
- `public abstract void setSwappable(boolean)`
- `public abstract boolean isDamageOnHurt()`
- `public abstract void setDamageOnHurt(boolean)`
- `public abstract boolean isEquipOnInteract()`
- `public abstract void setEquipOnInteract(boolean)`
- `public abstract boolean isCanBeSheared()`
- `public abstract void setCanBeSheared(boolean)`
- `public abstract org.bukkit.Sound getShearingSound()`
- `public abstract void setShearingSound(org.bukkit.Sound)`
