---
title: "org.bukkit.configuration.file.FileConfigurationOptions"
package: "org.bukkit.configuration.file"
source: https://jd.papermc.io/paper/26.3/org/bukkit/configuration/file/FileConfigurationOptions.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class FileConfigurationOptions**
`public class FileConfigurationOptions extends MemoryConfigurationOptions`
- `protected FileConfigurationOptions(@NotNull @NotNull MemoryConfiguration configuration)`
- `@NotNull public @NotNull FileConfiguration configuration()`
- `@NotNull public @NotNull FileConfigurationOptions copyDefaults(boolean value)`
- `@NotNull public @NotNull FileConfigurationOptions pathSeparator(char value)`
- `@NotNull public @NotNull List<String> getHeader()`
- `@NotNull @Deprecated(since="1.18.1") public @NotNull String header()`
- `@NotNull public @NotNull FileConfigurationOptions setHeader(@Nullable @Nullable List<String> value)`
- `@NotNull @Deprecated(since="1.18.1") public @NotNull FileConfigurationOptions header(@Nullable @Nullable String value)`
- `@NotNull public @NotNull List<String> getFooter()`
- `@NotNull public @NotNull FileConfigurationOptions setFooter(@Nullable @Nullable List<String> value)`
- `public boolean parseComments()`
- `@NotNull public @NotNull MemoryConfigurationOptions parseComments(boolean value)`
- `@Deprecated(since="1.18.1") public boolean copyHeader()`
- `@NotNull @Deprecated(since="1.18.1") public @NotNull FileConfigurationOptions copyHeader(boolean value)`
