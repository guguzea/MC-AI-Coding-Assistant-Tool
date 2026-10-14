---
title: "org.bukkit.persistence.PersistentDataContainer"
package: "org.bukkit.persistence"
source: https://jd.papermc.io/paper/26.3/org/bukkit/persistence/PersistentDataContainer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PersistentDataContainer**
`public interface PersistentDataContainer extends PersistentDataContainerView`
- `<P,C> void set(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull PersistentDataType<P,C> type, @NotNull C value)`
- `default <C> void set(@NotNull @NotNull PersistentDataKey<C> dataKey, @NotNull C value)`
- `void remove(@NotNull @NotNull NamespacedKey key)`
- `default void remove(@NotNull @NotNull PersistentDataKey<?> dataKey)`
- `void readFromBytes(byte @NotNull [] bytes, boolean clear) throws IOException`
- `default void readFromBytes(byte @NotNull [] bytes) throws IOException`
