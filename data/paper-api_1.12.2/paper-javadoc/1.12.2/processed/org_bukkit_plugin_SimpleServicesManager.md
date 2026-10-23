---
title: "org.bukkit.plugin.SimpleServicesManager"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.12.2/org/bukkit/plugin/SimpleServicesManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T09:54:19.288Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
---

- `Set<Class<?>> getKnownServices()`
- `<T> RegisteredServiceProvider<T> getRegistration(Class<T> service)`
- `<T> List<RegisteredServiceProvider<T>> getRegistrations(Class<T> service)`
- `List<RegisteredServiceProvider<?>> getRegistrations(Plugin plugin)`
- `<T> boolean isProvidedFor(Class<T> service)`
- `<T> T load(Class<T> service)`
- `<T> void register(Class<T> service, T provider, Plugin plugin, ServicePriority priority)`
- `void unregister(Class<?> service, Object provider)`
- `void unregister(Object provider)`
- `void unregisterAll(Plugin plugin)`
