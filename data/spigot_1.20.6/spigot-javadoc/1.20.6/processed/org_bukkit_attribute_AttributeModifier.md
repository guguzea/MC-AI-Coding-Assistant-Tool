---
title: "org.bukkit.attribute.AttributeModifier"
package: "org.bukkit.attribute"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public class org.bukkit.attribute.AttributeModifier implements org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public org.bukkit.attribute.AttributeModifier(java.lang.String, double, org.bukkit.attribute.AttributeModifier$Operation)`
- `public org.bukkit.attribute.AttributeModifier(java.util.UUID, java.lang.String, double, org.bukkit.attribute.AttributeModifier$Operation)`
- `public org.bukkit.attribute.AttributeModifier(java.util.UUID, java.lang.String, double, org.bukkit.attribute.AttributeModifier$Operation, org.bukkit.inventory.EquipmentSlot)`
- `public org.bukkit.attribute.AttributeModifier(java.util.UUID, java.lang.String, double, org.bukkit.attribute.AttributeModifier$Operation, org.bukkit.inventory.EquipmentSlotGroup)`
- `public java.util.UUID getUniqueId()`
- `public java.lang.String getName()`
- `public double getAmount()`
- `public org.bukkit.attribute.AttributeModifier$Operation getOperation()`
- `public org.bukkit.inventory.EquipmentSlot getSlot()`
- `public org.bukkit.inventory.EquipmentSlotGroup getSlotGroup()`
- `public java.util.Map<java.lang.String, java.lang.Object> serialize()`
- `public boolean equals(java.lang.Object)`
- `public int hashCode()`
- `public java.lang.String toString()`
- `public static org.bukkit.attribute.AttributeModifier deserialize(java.util.Map<java.lang.String, java.lang.Object>)`
