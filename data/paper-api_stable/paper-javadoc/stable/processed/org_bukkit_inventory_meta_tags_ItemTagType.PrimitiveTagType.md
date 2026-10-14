---
title: "org.bukkit.inventory.meta.tags.ItemTagType.PrimitiveTagType"
package: "org.bukkit.inventory.meta.tags"
source: https://jd.papermc.io/paper/26.3/org/bukkit/inventory/meta/tags/ItemTagType.PrimitiveTagType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class ItemTagType.PrimitiveTagType<T>**
`public static class ItemTagType.PrimitiveTagType<T> extends Object implements ItemTagType<T,T>`
- `@NotNull public @NotNull Class<T> getPrimitiveType()`
- `@NotNull public @NotNull Class<T> getComplexType()`
- `@NotNull public T toPrimitive(@NotNull T complex, @NotNull @NotNull ItemTagAdapterContext context)`
- `@NotNull public T fromPrimitive(@NotNull T primitive, @NotNull @NotNull ItemTagAdapterContext context)`
