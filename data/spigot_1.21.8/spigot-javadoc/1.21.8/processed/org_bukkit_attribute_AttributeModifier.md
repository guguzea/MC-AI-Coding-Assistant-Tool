---
title: "org.bukkit.attribute.AttributeModifier"
package: "org.bukkit.attribute"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public class org.bukkit.attribute.AttributeModifier implements org.bukkit.configuration.serialization.ConfigurationSerializable,org.bukkit.Keyed`
- `public org.bukkit.attribute.AttributeModifier(java.lang.String, double, org.bukkit.attribute.AttributeModifier$Operation)`
- `public org.bukkit.attribute.AttributeModifier(java.util.UUID, java.lang.String, double, org.bukkit.attribute.AttributeModifier$Operation)`
- `public org.bukkit.attribute.AttributeModifier(java.util.UUID, java.lang.String, double, org.bukkit.attribute.AttributeModifier$Operation, org.bukkit.inventory.EquipmentSlot)`
- `public org.bukkit.attribute.AttributeModifier(java.util.UUID, java.lang.String, double, org.bukkit.attribute.AttributeModifier$Operation, org.bukkit.inventory.EquipmentSlotGroup)`
- `public org.bukkit.attribute.AttributeModifier(org.bukkit.NamespacedKey, double, org.bukkit.attribute.AttributeModifier$Operation, org.bukkit.inventory.EquipmentSlotGroup)`
- `public java.util.UUID getUniqueId()`
- `public org.bukkit.NamespacedKey getKey()`
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
