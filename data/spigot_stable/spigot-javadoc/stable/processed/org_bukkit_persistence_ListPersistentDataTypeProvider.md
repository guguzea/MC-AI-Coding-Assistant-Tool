---
title: "org.bukkit.persistence.ListPersistentDataTypeProvider"
package: "org.bukkit.persistence"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/persistence/ListPersistentDataTypeProvider.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class ListPersistentDataTypeProvider**
`public final class ListPersistentDataTypeProvider extends Object`
- `@NotNull public ListPersistentDataType<Byte,Byte> bytes()`
- `@NotNull public ListPersistentDataType<Short,Short> shorts()`
- `@NotNull public ListPersistentDataType<Integer,Integer> integers()`
- `@NotNull public ListPersistentDataType<Long,Long> longs()`
- `@NotNull public ListPersistentDataType<Float,Float> floats()`
- `@NotNull public ListPersistentDataType<Double,Double> doubles()`
- `@NotNull public ListPersistentDataType<Byte,Boolean> booleans()`
- `@NotNull public ListPersistentDataType<String,String> strings()`
- `@NotNull public ListPersistentDataType<byte[],byte[]> byteArrays()`
- `@NotNull public ListPersistentDataType<int[],int[]> integerArrays()`
- `@NotNull public ListPersistentDataType<long[],long[]> longArrays()`
- `@NotNull public ListPersistentDataType<PersistentDataContainer, PersistentDataContainer> dataContainers()`
- `@NotNull public <P,C> ListPersistentDataType<P,C> listTypeFrom(@NotNull PersistentDataType<P,C> elementType)`
