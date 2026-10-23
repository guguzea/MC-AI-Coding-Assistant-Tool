---
title: "org.bukkit.persistence.PersistentDataContainer"
package: "org.bukkit.persistence"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
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
