---
title: "org.bukkit.metadata.LazyMetadataValue"
package: "org.bukkit.metadata"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/metadata/LazyMetadataValue.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `public LazyMetadataValue(@NotNull @NotNull Plugin owningPlugin, @NotNull @NotNull Callable<Object> lazyValue)`
- `public LazyMetadataValue(@NotNull @NotNull Plugin owningPlugin, @NotNull @NotNull LazyMetadataValue.CacheStrategy cacheStrategy, @NotNull @NotNull Callable<Object> lazyValue)`
- `protected LazyMetadataValue(@NotNull @NotNull Plugin owningPlugin)`
- `@Nullable public @Nullable Object value()`
- `public void invalidate()`
