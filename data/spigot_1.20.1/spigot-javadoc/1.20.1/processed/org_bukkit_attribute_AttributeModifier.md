---
title: "org.bukkit.attribute.AttributeModifier"
package: "org.bukkit.attribute"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public class org.bukkit.attribute.AttributeModifier implements org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public org.bukkit.attribute.AttributeModifier(java.lang.String, double, org.bukkit.attribute.AttributeModifier$Operation)`
- `public org.bukkit.attribute.AttributeModifier(java.util.UUID, java.lang.String, double, org.bukkit.attribute.AttributeModifier$Operation)`
- `public org.bukkit.attribute.AttributeModifier(java.util.UUID, java.lang.String, double, org.bukkit.attribute.AttributeModifier$Operation, org.bukkit.inventory.EquipmentSlot)`
- `public java.util.UUID getUniqueId()`
- `public java.lang.String getName()`
- `public double getAmount()`
- `public org.bukkit.attribute.AttributeModifier$Operation getOperation()`
- `public org.bukkit.inventory.EquipmentSlot getSlot()`
- `public java.util.Map<java.lang.String, java.lang.Object> serialize()`
- `public boolean equals(java.lang.Object)`
- `public int hashCode()`
- `public java.lang.String toString()`
- `public static org.bukkit.attribute.AttributeModifier deserialize(java.util.Map<java.lang.String, java.lang.Object>)`
