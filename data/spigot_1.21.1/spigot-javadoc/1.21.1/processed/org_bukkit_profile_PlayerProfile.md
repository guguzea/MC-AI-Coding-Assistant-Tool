---
title: "org.bukkit.profile.PlayerProfile"
package: "org.bukkit.profile"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public interface org.bukkit.profile.PlayerProfile extends java.lang.Cloneable,org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public abstract java.util.UUID getUniqueId()`
- `public abstract java.lang.String getName()`
- `public abstract org.bukkit.profile.PlayerTextures getTextures()`
- `public abstract void setTextures(org.bukkit.profile.PlayerTextures)`
- `public abstract boolean isComplete()`
- `public abstract java.util.concurrent.CompletableFuture<org.bukkit.profile.PlayerProfile> update()`
- `public abstract org.bukkit.profile.PlayerProfile clone()`
