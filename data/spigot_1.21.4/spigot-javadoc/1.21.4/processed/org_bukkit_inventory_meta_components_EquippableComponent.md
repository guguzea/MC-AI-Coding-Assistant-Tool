---
title: "org.bukkit.inventory.meta.components.EquippableComponent"
package: "org.bukkit.inventory.meta.components"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
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
