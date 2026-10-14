---
title: "org.bukkit.plugin.ServicesManager"
package: "org.bukkit.plugin"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/plugin/ServicesManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface ServicesManager**
`public interface ServicesManager`
- `<T> void register(@NotNull Class<T> service, @NotNull T provider, @NotNull Plugin plugin, @NotNull ServicePriority priority)`
- `void unregisterAll(@NotNull Plugin plugin)`
- `void unregister(@NotNull Class<?> service, @NotNull Object provider)`
- `void unregister(@NotNull Object provider)`
- `@Nullable <T> T load(@NotNull Class<T> service)`
- `@Nullable <T> RegisteredServiceProvider<T> getRegistration(@NotNull Class<T> service)`
- `@NotNull List<RegisteredServiceProvider<?>> getRegistrations(@NotNull Plugin plugin)`
- `@NotNull <T> Collection<RegisteredServiceProvider<T>> getRegistrations(@NotNull Class<T> service)`
- `@NotNull Collection<Class<?>> getKnownServices()`
- `<T> boolean isProvidedFor(@NotNull Class<T> service)`
