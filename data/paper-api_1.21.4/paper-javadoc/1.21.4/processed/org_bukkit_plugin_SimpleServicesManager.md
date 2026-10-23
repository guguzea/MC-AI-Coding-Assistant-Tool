---
title: "org.bukkit.plugin.SimpleServicesManager"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/plugin/SimpleServicesManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public SimpleServicesManager()`
- `public <T> void register(@NotNull @NotNull Class<T> service, @NotNull T provider, @NotNull @NotNull Plugin plugin, @NotNull @NotNull ServicePriority priority)`
- `public void unregisterAll(@NotNull @NotNull Plugin plugin)`
- `public void unregister(@NotNull @NotNull Class<?> service, @NotNull @NotNull Object provider)`
- `public void unregister(@NotNull @NotNull Object provider)`
- `@Nullable public <T> T load(@NotNull @NotNull Class<T> service)`
- `@Nullable public <T> @Nullable RegisteredServiceProvider<T> getRegistration(@NotNull @NotNull Class<T> service)`
- `@NotNull public @NotNull List<RegisteredServiceProvider<?>> getRegistrations(@NotNull @NotNull Plugin plugin)`
- `@NotNull public <T> @NotNull List<RegisteredServiceProvider<T>> getRegistrations(@NotNull @NotNull Class<T> service)`
- `@NotNull public @NotNull Set<Class<?>> getKnownServices()`
- `public <T> boolean isProvidedFor(@NotNull @NotNull Class<T> service)`
