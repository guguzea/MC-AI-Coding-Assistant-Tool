---
title: "org.bukkit.profile.PlayerProfile"
package: "org.bukkit.profile"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.profile.PlayerProfile extends java.lang.Cloneable,org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public abstract java.util.UUID getUniqueId()`
- `public abstract java.lang.String getName()`
- `public abstract org.bukkit.profile.PlayerTextures getTextures()`
- `public abstract void setTextures(org.bukkit.profile.PlayerTextures)`
- `public abstract boolean isComplete()`
- `public abstract java.util.concurrent.CompletableFuture<org.bukkit.profile.PlayerProfile> update()`
- `public abstract org.bukkit.profile.PlayerProfile clone()`
