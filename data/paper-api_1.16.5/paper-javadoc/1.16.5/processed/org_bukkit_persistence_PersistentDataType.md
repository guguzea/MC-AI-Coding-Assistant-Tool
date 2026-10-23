---
title: "org.bukkit.persistence.PersistentDataType"
package: "org.bukkit.persistence"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/persistence/PersistentDataType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `static final PersistentDataType<Byte,&#8203;Byte> BYTE`
- `static final PersistentDataType<Short,&#8203;Short> SHORT`
- `static final PersistentDataType<Integer,&#8203;Integer> INTEGER`
- `static final PersistentDataType<Long,&#8203;Long> LONG`
- `static final PersistentDataType<Float,&#8203;Float> FLOAT`
- `static final PersistentDataType<Double,&#8203;Double> DOUBLE`
- `static final PersistentDataType<String,&#8203;String> STRING`
- `static final PersistentDataType<byte[],&#8203;byte[]> BYTE_ARRAY`
- `static final PersistentDataType<int[],&#8203;int[]> INTEGER_ARRAY`
- `static final PersistentDataType<long[],&#8203;long[]> LONG_ARRAY`
- `static final PersistentDataType<PersistentDataContainer[],&#8203;PersistentDataContainer[]> TAG_CONTAINER_ARRAY`
- `static final PersistentDataType<PersistentDataContainer,&#8203;PersistentDataContainer> TAG_CONTAINER`
- `@NotNull @NotNull Class<T> getPrimitiveType()`
- `@NotNull @NotNull Class<Z> getComplexType()`
- `@NotNull T toPrimitive&#8203;(@NotNull Z complex, @NotNull @NotNull PersistentDataAdapterContext context)`
- `@NotNull Z fromPrimitive&#8203;(@NotNull T primitive, @NotNull @NotNull PersistentDataAdapterContext context)`
