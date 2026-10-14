---
title: "org.bukkit.metadata.LazyMetadataValue"
package: "org.bukkit.metadata"
source: https://jd.papermc.io/paper/26.3/org/bukkit/metadata/LazyMetadataValue.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Class LazyMetadataValue**
`@Deprecated public class LazyMetadataValue extends MetadataValueAdapter`
- `public LazyMetadataValue(@NotNull @NotNull Plugin owningPlugin, @NotNull @NotNull Callable<Object> lazyValue)`
- `public LazyMetadataValue(@NotNull @NotNull Plugin owningPlugin, @NotNull @NotNull LazyMetadataValue.CacheStrategy cacheStrategy, @NotNull @NotNull Callable<Object> lazyValue)`
- `protected LazyMetadataValue(@NotNull @NotNull Plugin owningPlugin)`
- `@Nullable public @Nullable Object value()`
- `public void invalidate()`
