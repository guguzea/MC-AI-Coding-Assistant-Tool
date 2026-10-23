---
title: "org.bukkit.metadata.LazyMetadataValue"
package: "org.bukkit.metadata"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/metadata/LazyMetadataValue.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `public LazyMetadataValue&#8203;(@NotNull @NotNull Plugin owningPlugin, @NotNull @NotNull Callable<Object> lazyValue)`
- `public LazyMetadataValue&#8203;(@NotNull @NotNull Plugin owningPlugin, @NotNull @NotNull LazyMetadataValue.CacheStrategy cacheStrategy, @NotNull @NotNull Callable<Object> lazyValue)`
- `protected LazyMetadataValue&#8203;(@NotNull @NotNull Plugin owningPlugin)`
- `@Nullable public @Nullable Object value()`
- `public void invalidate()`
