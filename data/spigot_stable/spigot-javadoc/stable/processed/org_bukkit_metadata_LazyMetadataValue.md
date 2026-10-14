---
title: "org.bukkit.metadata.LazyMetadataValue"
package: "org.bukkit.metadata"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/metadata/LazyMetadataValue.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class LazyMetadataValue**
`public class LazyMetadataValue extends MetadataValueAdapter`
- `public LazyMetadataValue(@NotNull Plugin owningPlugin, @NotNull Callable<Object> lazyValue)`
- `public LazyMetadataValue(@NotNull Plugin owningPlugin, @NotNull LazyMetadataValue.CacheStrategy cacheStrategy, @NotNull Callable<Object> lazyValue)`
- `protected LazyMetadataValue(@NotNull Plugin owningPlugin)`
- `@Nullable public Object value()`
- `public void invalidate()`
