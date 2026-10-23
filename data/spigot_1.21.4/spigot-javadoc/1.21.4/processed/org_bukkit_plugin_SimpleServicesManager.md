---
title: "org.bukkit.plugin.SimpleServicesManager"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.4-R0.1-SNAPSHOT/spigot-api-1.21.4-R0.1-20250325.160956-56.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:30:34.551Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
jarMd5: "6ce70a28800bf30e68da45b12871f1f2"
---

- `public class org.bukkit.plugin.SimpleServicesManager implements org.bukkit.plugin.ServicesManager`
- `public org.bukkit.plugin.SimpleServicesManager()`
- `public <T> void register(java.lang.Class<T>, T, org.bukkit.plugin.Plugin, org.bukkit.plugin.ServicePriority)`
- `public void unregisterAll(org.bukkit.plugin.Plugin)`
- `public void unregister(java.lang.Class<?>, java.lang.Object)`
- `public void unregister(java.lang.Object)`
- `public <T> T load(java.lang.Class<T>)`
- `public <T> org.bukkit.plugin.RegisteredServiceProvider<T> getRegistration(java.lang.Class<T>)`
- `public java.util.List<org.bukkit.plugin.RegisteredServiceProvider<?>> getRegistrations(org.bukkit.plugin.Plugin)`
- `public <T> java.util.List<org.bukkit.plugin.RegisteredServiceProvider<T>> getRegistrations(java.lang.Class<T>)`
- `public java.util.Set<java.lang.Class<?>> getKnownServices()`
- `public <T> boolean isProvidedFor(java.lang.Class<T>)`
- `public java.util.Collection getKnownServices()`
- `public java.util.Collection getRegistrations(java.lang.Class)`
