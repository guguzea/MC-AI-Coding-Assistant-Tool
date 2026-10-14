---
title: "org.bukkit.plugin.SimpleServicesManager"
package: "org.bukkit.plugin"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/SimpleServicesManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class SimpleServicesManager**
`public class SimpleServicesManager extends Object implements ServicesManager`
- `public SimpleServicesManager()`
- `public <T> void register(@NotNull Class<T> service, @NotNull T provider, @NotNull Plugin plugin, @NotNull ServicePriority priority)`
- `public void unregisterAll(@NotNull Plugin plugin)`
- `public void unregister(@NotNull Class<?> service, @NotNull Object provider)`
- `public void unregister(@NotNull Object provider)`
- `@Nullable public <T> T load(@NotNull Class<T> service)`
- `@Nullable public <T> RegisteredServiceProvider<T> getRegistration(@NotNull Class<T> service)`
- `@NotNull public List<RegisteredServiceProvider<?>> getRegistrations(@NotNull Plugin plugin)`
- `@NotNull public <T> List<RegisteredServiceProvider<T>> getRegistrations(@NotNull Class<T> service)`
- `@NotNull public Set<Class<?>> getKnownServices()`
- `public <T> boolean isProvidedFor(@NotNull Class<T> service)`
