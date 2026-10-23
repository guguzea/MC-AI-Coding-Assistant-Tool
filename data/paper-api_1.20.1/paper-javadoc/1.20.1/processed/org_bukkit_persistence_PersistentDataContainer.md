---
title: "org.bukkit.persistence.PersistentDataContainer"
package: "org.bukkit.persistence"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/persistence/PersistentDataContainer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `<T, Z> void set(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull PersistentDataType<T,Z> type, @NotNull Z value)`
- `<T, Z> boolean has(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull PersistentDataType<T,Z> type)`
- `@Nullable <T, Z> Z get(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull PersistentDataType<T,Z> type)`
- `@NotNull <T, Z> Z getOrDefault(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull PersistentDataType<T,Z> type, @NotNull Z defaultValue)`
- `@NotNull @NotNull Set<NamespacedKey> getKeys()`
- `void remove(@NotNull @NotNull NamespacedKey key)`
- `boolean isEmpty()`
- `@NotNull @NotNull PersistentDataAdapterContext getAdapterContext()`
- `boolean has(@NotNull @NotNull NamespacedKey key)`
- `byte @NotNull [] serializeToBytes() throws IOException`
- `void readFromBytes(byte @NotNull [] bytes, boolean clear) throws IOException`
- `default void readFromBytes(byte @NotNull [] bytes) throws IOException`
