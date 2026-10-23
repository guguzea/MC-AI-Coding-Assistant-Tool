---
title: "org.bukkit.persistence.PersistentDataContainer"
package: "org.bukkit.persistence"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public interface org.bukkit.persistence.PersistentDataContainer`
- `public abstract <P, C> void set(org.bukkit.NamespacedKey, org.bukkit.persistence.PersistentDataType<P, C>, C)`
- `public abstract <P, C> boolean has(org.bukkit.NamespacedKey, org.bukkit.persistence.PersistentDataType<P, C>)`
- `public abstract boolean has(org.bukkit.NamespacedKey)`
- `public abstract <P, C> C get(org.bukkit.NamespacedKey, org.bukkit.persistence.PersistentDataType<P, C>)`
- `public abstract <P, C> C getOrDefault(org.bukkit.NamespacedKey, org.bukkit.persistence.PersistentDataType<P, C>, C)`
- `public abstract java.util.Set<org.bukkit.NamespacedKey> getKeys()`
- `public abstract void remove(org.bukkit.NamespacedKey)`
- `public abstract boolean isEmpty()`
- `public abstract void copyTo(org.bukkit.persistence.PersistentDataContainer, boolean)`
- `public abstract org.bukkit.persistence.PersistentDataAdapterContext getAdapterContext()`
