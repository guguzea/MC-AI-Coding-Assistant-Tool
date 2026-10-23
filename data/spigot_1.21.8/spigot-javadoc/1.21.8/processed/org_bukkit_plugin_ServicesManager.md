---
title: "org.bukkit.plugin.ServicesManager"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.plugin.ServicesManager`
- `public abstract <T> void register(java.lang.Class<T>, T, org.bukkit.plugin.Plugin, org.bukkit.plugin.ServicePriority)`
- `public abstract void unregisterAll(org.bukkit.plugin.Plugin)`
- `public abstract void unregister(java.lang.Class<?>, java.lang.Object)`
- `public abstract void unregister(java.lang.Object)`
- `public abstract <T> T load(java.lang.Class<T>)`
- `public abstract <T> org.bukkit.plugin.RegisteredServiceProvider<T> getRegistration(java.lang.Class<T>)`
- `public abstract java.util.List<org.bukkit.plugin.RegisteredServiceProvider<?>> getRegistrations(org.bukkit.plugin.Plugin)`
- `public abstract <T> java.util.Collection<org.bukkit.plugin.RegisteredServiceProvider<T>> getRegistrations(java.lang.Class<T>)`
- `public abstract java.util.Collection<java.lang.Class<?>> getKnownServices()`
- `public abstract <T> boolean isProvidedFor(java.lang.Class<T>)`
