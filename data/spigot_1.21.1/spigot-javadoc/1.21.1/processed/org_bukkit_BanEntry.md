---
title: "org.bukkit.BanEntry"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public interface org.bukkit.BanEntry<T>`
- `public abstract java.lang.String getTarget()`
- `public abstract T getBanTarget()`
- `public abstract java.util.Date getCreated()`
- `public abstract void setCreated(java.util.Date)`
- `public abstract java.lang.String getSource()`
- `public abstract void setSource(java.lang.String)`
- `public abstract java.util.Date getExpiration()`
- `public abstract void setExpiration(java.util.Date)`
- `public abstract java.lang.String getReason()`
- `public abstract void setReason(java.lang.String)`
- `public abstract void save()`
- `public abstract void remove()`
