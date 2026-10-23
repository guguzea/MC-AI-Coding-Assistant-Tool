---
title: "org.bukkit.BanEntry"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
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
