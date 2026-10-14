---
title: "org.bukkit.configuration.MemoryConfiguration"
package: "org.bukkit.configuration"
source: https://jd.papermc.io/paper/26.3/org/bukkit/configuration/MemoryConfiguration.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class MemoryConfiguration**
`public class MemoryConfiguration extends MemorySection implements Configuration`
- `protected Configuration defaults`
- `protected MemoryConfigurationOptions options`
- `public MemoryConfiguration()`
- `public MemoryConfiguration(@Nullable @Nullable Configuration defaults)`
- `public void addDefault(@NotNull @NotNull String path, @Nullable @Nullable Object value)`
- `public void addDefaults(@NotNull @NotNull Map<String,Object> defaults)`
- `public void addDefaults(@NotNull @NotNull Configuration defaults)`
- `public void setDefaults(@NotNull @NotNull Configuration defaults)`
- `@Nullable public @Nullable Configuration getDefaults()`
- `@Nullable public @Nullable ConfigurationSection getParent()`
- `@NotNull public @NotNull MemoryConfigurationOptions options()`
