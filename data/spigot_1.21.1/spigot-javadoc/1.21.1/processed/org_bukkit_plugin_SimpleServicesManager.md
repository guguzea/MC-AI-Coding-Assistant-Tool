---
title: "org.bukkit.plugin.SimpleServicesManager"
package: "org.bukkit.plugin"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
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
