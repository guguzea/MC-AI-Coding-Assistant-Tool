---
title: "org.bukkit.plugin.ServicesManager"
package: "org.bukkit.plugin"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/plugin/ServicesManager.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `<T> void register(@NotNull @NotNull Class<T> service, @NotNull T provider, @NotNull @NotNull Plugin plugin, @NotNull @NotNull ServicePriority priority)`
- `void unregisterAll(@NotNull @NotNull Plugin plugin)`
- `void unregister(@NotNull @NotNull Class<?> service, @NotNull @NotNull Object provider)`
- `void unregister(@NotNull @NotNull Object provider)`
- `@Nullable <T> T load(@NotNull @NotNull Class<T> service)`
- `@Nullable <T> @Nullable RegisteredServiceProvider<T> getRegistration(@NotNull @NotNull Class<T> service)`
- `@NotNull @NotNull List<RegisteredServiceProvider<?>> getRegistrations(@NotNull @NotNull Plugin plugin)`
- `@NotNull <T> @NotNull Collection<RegisteredServiceProvider<T>> getRegistrations(@NotNull @NotNull Class<T> service)`
- `@NotNull @NotNull Collection<Class<?>> getKnownServices()`
- `<T> boolean isProvidedFor(@NotNull @NotNull Class<T> service)`
