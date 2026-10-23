---
title: "org.bukkit.profile.PlayerProfile"
package: "org.bukkit.profile"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.profile.PlayerProfile extends java.lang.Cloneable,org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public abstract java.util.UUID getUniqueId()`
- `public abstract java.lang.String getName()`
- `public abstract org.bukkit.profile.PlayerTextures getTextures()`
- `public abstract void setTextures(org.bukkit.profile.PlayerTextures)`
- `public abstract boolean isComplete()`
- `public abstract java.util.concurrent.CompletableFuture<org.bukkit.profile.PlayerProfile> update()`
- `public abstract org.bukkit.profile.PlayerProfile clone()`
