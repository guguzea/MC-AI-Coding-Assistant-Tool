---
title: "org.bukkit.persistence.PersistentDataType"
package: "org.bukkit.persistence"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public interface org.bukkit.persistence.PersistentDataType<P, C>`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.Byte, java.lang.Byte> BYTE`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.Short, java.lang.Short> SHORT`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.Integer, java.lang.Integer> INTEGER`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.Long, java.lang.Long> LONG`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.Float, java.lang.Float> FLOAT`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.Double, java.lang.Double> DOUBLE`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.Byte, java.lang.Boolean> BOOLEAN`
- `public static final org.bukkit.persistence.PersistentDataType<java.lang.String, java.lang.String> STRING`
- `public static final org.bukkit.persistence.PersistentDataType<byte[], byte[]> BYTE_ARRAY`
- `public static final org.bukkit.persistence.PersistentDataType<int[], int[]> INTEGER_ARRAY`
- `public static final org.bukkit.persistence.PersistentDataType<long[], long[]> LONG_ARRAY`
- `public static final org.bukkit.persistence.PersistentDataType<org.bukkit.persistence.PersistentDataContainer[], org.bukkit.persistence.PersistentDataContainer[]> TAG_CONTAINER_ARRAY`
- `public static final org.bukkit.persistence.PersistentDataType<org.bukkit.persistence.PersistentDataContainer, org.bukkit.persistence.PersistentDataContainer> TAG_CONTAINER`
- `public static final org.bukkit.persistence.ListPersistentDataTypeProvider LIST`
- `public abstract java.lang.Class<P> getPrimitiveType()`
- `public abstract java.lang.Class<C> getComplexType()`
- `public abstract P toPrimitive(C, org.bukkit.persistence.PersistentDataAdapterContext)`
- `public abstract C fromPrimitive(P, org.bukkit.persistence.PersistentDataAdapterContext)`
