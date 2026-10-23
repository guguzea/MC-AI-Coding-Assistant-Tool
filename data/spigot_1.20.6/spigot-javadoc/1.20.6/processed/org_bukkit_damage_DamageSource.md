---
title: "org.bukkit.damage.DamageSource"
package: "org.bukkit.damage"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.damage.DamageSource`
- `public abstract org.bukkit.damage.DamageType getDamageType()`
- `public abstract org.bukkit.entity.Entity getCausingEntity()`
- `public abstract org.bukkit.entity.Entity getDirectEntity()`
- `public abstract org.bukkit.Location getDamageLocation()`
- `public abstract org.bukkit.Location getSourceLocation()`
- `public abstract boolean isIndirect()`
- `public abstract float getFoodExhaustion()`
- `public abstract boolean scalesWithDifficulty()`
- `public static org.bukkit.damage.DamageSource$Builder builder(org.bukkit.damage.DamageType)`
