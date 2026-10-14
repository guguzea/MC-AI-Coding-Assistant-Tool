---
title: "org.bukkit.inventory.meta.tags.ItemTagType"
package: "org.bukkit.inventory.meta.tags"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/tags/ItemTagType.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface ItemTagType<T,Z>**
`@Deprecated(since="1.14") public interface ItemTagType<T,Z>`
- `static final ItemTagType<Byte,Byte> BYTE`
- `static final ItemTagType<Short,Short> SHORT`
- `static final ItemTagType<Integer,Integer> INTEGER`
- `static final ItemTagType<Long,Long> LONG`
- `static final ItemTagType<Float,Float> FLOAT`
- `static final ItemTagType<Double,Double> DOUBLE`
- `static final ItemTagType<String,String> STRING`
- `static final ItemTagType<byte[],byte[]> BYTE_ARRAY`
- `static final ItemTagType<int[],int[]> INTEGER_ARRAY`
- `static final ItemTagType<long[],long[]> LONG_ARRAY`
- `static final ItemTagType<CustomItemTagContainer, CustomItemTagContainer> TAG_CONTAINER`
- `@NotNull Class<T> getPrimitiveType()`
- `@NotNull Class<Z> getComplexType()`
- `@NotNull T toPrimitive(@NotNull Z complex, @NotNull ItemTagAdapterContext context)`
- `@NotNull Z fromPrimitive(@NotNull T primitive, @NotNull ItemTagAdapterContext context)`
