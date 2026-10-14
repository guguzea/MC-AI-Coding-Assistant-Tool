---
title: "org.bukkit.configuration.Configuration"
package: "org.bukkit.configuration"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/configuration/Configuration.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Configuration**
`public interface Configuration extends ConfigurationSection`
- `void addDefault(@NotNull String path, @Nullable Object value)`
- `void addDefaults(@NotNull Map<String,Object> defaults)`
- `void addDefaults(@NotNull Configuration defaults)`
- `void setDefaults(@NotNull Configuration defaults)`
- `@Nullable Configuration getDefaults()`
- `@NotNull ConfigurationOptions options()`
