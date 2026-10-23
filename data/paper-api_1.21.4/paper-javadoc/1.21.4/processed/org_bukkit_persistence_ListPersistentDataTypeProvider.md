---
title: "org.bukkit.persistence.ListPersistentDataTypeProvider"
package: "org.bukkit.persistence"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/persistence/ListPersistentDataTypeProvider.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@NotNull public @NotNull ListPersistentDataType<Byte,Byte> bytes()`
- `@NotNull public @NotNull ListPersistentDataType<Short,Short> shorts()`
- `@NotNull public @NotNull ListPersistentDataType<Integer,Integer> integers()`
- `@NotNull public @NotNull ListPersistentDataType<Long,Long> longs()`
- `@NotNull public @NotNull ListPersistentDataType<Float,Float> floats()`
- `@NotNull public @NotNull ListPersistentDataType<Double,Double> doubles()`
- `@NotNull public @NotNull ListPersistentDataType<Byte,Boolean> booleans()`
- `@NotNull public @NotNull ListPersistentDataType<String,String> strings()`
- `@NotNull public @NotNull ListPersistentDataType<byte[],byte[]> byteArrays()`
- `@NotNull public @NotNull ListPersistentDataType<int[],int[]> integerArrays()`
- `@NotNull public @NotNull ListPersistentDataType<long[],long[]> longArrays()`
- `@NotNull public @NotNull ListPersistentDataType<PersistentDataContainer,PersistentDataContainer> dataContainers()`
- `@NotNull public <P, C> @NotNull ListPersistentDataType<P,C> listTypeFrom(@NotNull @NotNull PersistentDataType<P,C> elementType)`
