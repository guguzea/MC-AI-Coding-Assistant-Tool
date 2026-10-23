---
title: "org.bukkit.inventory.meta.tags.ItemTagType"
package: "org.bukkit.inventory.meta.tags"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/inventory/meta/tags/ItemTagType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `static final ItemTagType<Byte,&#8203;Byte> BYTE`
- `static final ItemTagType<Short,&#8203;Short> SHORT`
- `static final ItemTagType<Integer,&#8203;Integer> INTEGER`
- `static final ItemTagType<Long,&#8203;Long> LONG`
- `static final ItemTagType<Float,&#8203;Float> FLOAT`
- `static final ItemTagType<Double,&#8203;Double> DOUBLE`
- `static final ItemTagType<String,&#8203;String> STRING`
- `static final ItemTagType<byte[],&#8203;byte[]> BYTE_ARRAY`
- `static final ItemTagType<int[],&#8203;int[]> INTEGER_ARRAY`
- `static final ItemTagType<long[],&#8203;long[]> LONG_ARRAY`
- `static final ItemTagType<CustomItemTagContainer,&#8203;CustomItemTagContainer> TAG_CONTAINER`
- `@NotNull @NotNull Class<T> getPrimitiveType()`
- `@NotNull @NotNull Class<Z> getComplexType()`
- `@NotNull T toPrimitive&#8203;(@NotNull Z complex, @NotNull @NotNull ItemTagAdapterContext context)`
- `@NotNull Z fromPrimitive&#8203;(@NotNull T primitive, @NotNull @NotNull ItemTagAdapterContext context)`
