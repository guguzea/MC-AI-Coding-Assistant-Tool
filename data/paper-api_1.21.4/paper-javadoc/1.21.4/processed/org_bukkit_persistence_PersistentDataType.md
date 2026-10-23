---
title: "org.bukkit.persistence.PersistentDataType"
package: "org.bukkit.persistence"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/persistence/PersistentDataType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `static final PersistentDataType<Byte,Byte> BYTE`
- `static final PersistentDataType<Short,Short> SHORT`
- `static final PersistentDataType<Integer,Integer> INTEGER`
- `static final PersistentDataType<Long,Long> LONG`
- `static final PersistentDataType<Float,Float> FLOAT`
- `static final PersistentDataType<Double,Double> DOUBLE`
- `static final PersistentDataType<Byte,Boolean> BOOLEAN`
- `static final PersistentDataType<String,String> STRING`
- `static final PersistentDataType<byte[],byte[]> BYTE_ARRAY`
- `static final PersistentDataType<int[],int[]> INTEGER_ARRAY`
- `static final PersistentDataType<long[],long[]> LONG_ARRAY`
- `@Deprecated(since="1.20.4") static final PersistentDataType<PersistentDataContainer[],PersistentDataContainer[]> TAG_CONTAINER_ARRAY`
- `static final PersistentDataType<PersistentDataContainer,PersistentDataContainer> TAG_CONTAINER`
- `static final ListPersistentDataTypeProvider LIST`
- `@NotNull @NotNull Class<P> getPrimitiveType()`
- `@NotNull @NotNull Class<C> getComplexType()`
- `@NotNull P toPrimitive(@NotNull C complex, @NotNull @NotNull PersistentDataAdapterContext context)`
- `@NotNull C fromPrimitive(@NotNull P primitive, @NotNull @NotNull PersistentDataAdapterContext context)`
