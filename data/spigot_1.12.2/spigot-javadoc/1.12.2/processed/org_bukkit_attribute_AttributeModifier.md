---
title: "org.bukkit.attribute.AttributeModifier"
package: "org.bukkit.attribute"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.attribute.AttributeModifier implements org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public org.bukkit.attribute.AttributeModifier(java.lang.String, double, org.bukkit.attribute.AttributeModifier$Operation)`
- `public org.bukkit.attribute.AttributeModifier(java.util.UUID, java.lang.String, double, org.bukkit.attribute.AttributeModifier$Operation)`
- `public java.util.UUID getUniqueId()`
- `public java.lang.String getName()`
- `public double getAmount()`
- `public org.bukkit.attribute.AttributeModifier$Operation getOperation()`
- `public java.util.Map<java.lang.String, java.lang.Object> serialize()`
- `public static org.bukkit.attribute.AttributeModifier deserialize(java.util.Map<java.lang.String, java.lang.Object>)`
