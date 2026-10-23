---
title: "org.bukkit.inventory.meta.components.ToolComponent"
package: "org.bukkit.inventory.meta.components"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.inventory.meta.components.ToolComponent extends org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public abstract float getDefaultMiningSpeed()`
- `public abstract void setDefaultMiningSpeed(float)`
- `public abstract int getDamagePerBlock()`
- `public abstract void setDamagePerBlock(int)`
- `public abstract java.util.List<org.bukkit.inventory.meta.components.ToolComponent$ToolRule> getRules()`
- `public abstract void setRules(java.util.List<org.bukkit.inventory.meta.components.ToolComponent$ToolRule>)`
- `public abstract org.bukkit.inventory.meta.components.ToolComponent$ToolRule addRule(org.bukkit.Material, java.lang.Float, java.lang.Boolean)`
- `public abstract org.bukkit.inventory.meta.components.ToolComponent$ToolRule addRule(java.util.Collection<org.bukkit.Material>, java.lang.Float, java.lang.Boolean)`
- `public abstract org.bukkit.inventory.meta.components.ToolComponent$ToolRule addRule(org.bukkit.Tag<org.bukkit.Material>, java.lang.Float, java.lang.Boolean)`
- `public abstract boolean removeRule(org.bukkit.inventory.meta.components.ToolComponent$ToolRule)`
