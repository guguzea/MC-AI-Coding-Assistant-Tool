---
title: "org.bukkit.inventory.meta.tags.ItemTagType"
package: "org.bukkit.inventory.meta.tags"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.6-R0.1-SNAPSHOT/spigot-api-1.20.6-R0.1-20240613.150924-57.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:57:44.525Z
asOfVersion: "1.20.6-R0.1-SNAPSHOT"
jarMd5: "90b42d6249e7f6ec8efbf14c97549d3e"
---

- `public interface org.bukkit.inventory.meta.tags.ItemTagType<T, Z>`
- `public static final org.bukkit.inventory.meta.tags.ItemTagType<java.lang.Byte, java.lang.Byte> BYTE`
- `public static final org.bukkit.inventory.meta.tags.ItemTagType<java.lang.Short, java.lang.Short> SHORT`
- `public static final org.bukkit.inventory.meta.tags.ItemTagType<java.lang.Integer, java.lang.Integer> INTEGER`
- `public static final org.bukkit.inventory.meta.tags.ItemTagType<java.lang.Long, java.lang.Long> LONG`
- `public static final org.bukkit.inventory.meta.tags.ItemTagType<java.lang.Float, java.lang.Float> FLOAT`
- `public static final org.bukkit.inventory.meta.tags.ItemTagType<java.lang.Double, java.lang.Double> DOUBLE`
- `public static final org.bukkit.inventory.meta.tags.ItemTagType<java.lang.String, java.lang.String> STRING`
- `public static final org.bukkit.inventory.meta.tags.ItemTagType<byte[], byte[]> BYTE_ARRAY`
- `public static final org.bukkit.inventory.meta.tags.ItemTagType<int[], int[]> INTEGER_ARRAY`
- `public static final org.bukkit.inventory.meta.tags.ItemTagType<long[], long[]> LONG_ARRAY`
- `public static final org.bukkit.inventory.meta.tags.ItemTagType<org.bukkit.inventory.meta.tags.CustomItemTagContainer, org.bukkit.inventory.meta.tags.CustomItemTagContainer> TAG_CONTAINER`
- `public abstract java.lang.Class<T> getPrimitiveType()`
- `public abstract java.lang.Class<Z> getComplexType()`
- `public abstract T toPrimitive(Z, org.bukkit.inventory.meta.tags.ItemTagAdapterContext)`
- `public abstract Z fromPrimitive(T, org.bukkit.inventory.meta.tags.ItemTagAdapterContext)`
