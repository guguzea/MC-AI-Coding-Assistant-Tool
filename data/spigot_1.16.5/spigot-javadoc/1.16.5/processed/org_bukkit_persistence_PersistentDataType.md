---
title: "org.bukkit.persistence.PersistentDataType"
package: "org.bukkit.persistence"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.16.5-R0.1-SNAPSHOT/spigot-api-1.16.5-R0.1-20210611.041013-99.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:34:22.101Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
jarMd5: "f6f72446ce3adfc1c820a97d7fa56c8c"
---

- `public interface org.bukkit.persistence.PersistentDataType<T, Z>`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.Byte, java.lang.Byte> BYTE`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.Short, java.lang.Short> SHORT`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.Integer, java.lang.Integer> INTEGER`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.Long, java.lang.Long> LONG`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.Float, java.lang.Float> FLOAT`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.Double, java.lang.Double> DOUBLE`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.String, java.lang.String> STRING`
- `public static final org.bukkit.persistence.PersistentDataType<byte[], byte[]> BYTE_ARRAY`
- `public static final org.bukkit.persistence.PersistentDataType<int[], int[]> INTEGER_ARRAY`
- `public static final org.bukkit.persistence.PersistentDataType<long[], long[]> LONG_ARRAY`
- `public static final org.bukkit.persistence.PersistentDataType<org.bukkit.persistence.PersistentDataContainer[], org.bukkit.persistence.PersistentDataContainer[]> TAG_CONTAINER_ARRAY`
- `public static final org.bukkit.persistence.PersistentDataType<org.bukkit.persistence.PersistentDataContainer, org.bukkit.persistence.PersistentDataContainer> TAG_CONTAINER`
- `public abstract java.lang.Class<T> getPrimitiveType()`
- `public abstract java.lang.Class<Z> getComplexType()`
- `public abstract T toPrimitive(Z, org.bukkit.persistence.PersistentDataAdapterContext)`
- `public abstract Z fromPrimitive(T, org.bukkit.persistence.PersistentDataAdapterContext)`
