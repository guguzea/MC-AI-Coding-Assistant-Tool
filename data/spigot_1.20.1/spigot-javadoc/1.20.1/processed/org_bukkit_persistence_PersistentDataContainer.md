---
title: "org.bukkit.persistence.PersistentDataContainer"
package: "org.bukkit.persistence"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
---

- `public interface org.bukkit.persistence.PersistentDataContainer`
- `public abstract <T, Z> void set(org.bukkit.NamespacedKey, org.bukkit.persistence.PersistentDataType<T, Z>, Z)`
- `public abstract <T, Z> boolean has(org.bukkit.NamespacedKey, org.bukkit.persistence.PersistentDataType<T, Z>)`
- `public abstract <T, Z> Z get(org.bukkit.NamespacedKey, org.bukkit.persistence.PersistentDataType<T, Z>)`
- `public abstract <T, Z> Z getOrDefault(org.bukkit.NamespacedKey, org.bukkit.persistence.PersistentDataType<T, Z>, Z)`
- `public abstract java.util.Set<org.bukkit.NamespacedKey> getKeys()`
- `public abstract void remove(org.bukkit.NamespacedKey)`
- `public abstract boolean isEmpty()`
- `public abstract org.bukkit.persistence.PersistentDataAdapterContext getAdapterContext()`
