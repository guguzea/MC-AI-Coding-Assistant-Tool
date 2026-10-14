---
title: "org.bukkit.configuration.Configuration"
package: "org.bukkit.configuration"
source: https://jd.papermc.io/paper/26.3/org/bukkit/configuration/Configuration.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Configuration**
`public interface Configuration extends ConfigurationSection`
- `void addDefault(@NotNull @NotNull String path, @Nullable @Nullable Object value)`
- `void addDefaults(@NotNull @NotNull Map<String,Object> defaults)`
- `void addDefaults(@NotNull @NotNull Configuration defaults)`
- `void setDefaults(@NotNull @NotNull Configuration defaults)`
- `@Nullable @Nullable Configuration getDefaults()`
- `@NotNull @NotNull ConfigurationOptions options()`
