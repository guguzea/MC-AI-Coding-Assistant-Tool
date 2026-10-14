---
title: "org.bukkit.persistence.PersistentDataContainer"
package: "org.bukkit.persistence"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/persistence/PersistentDataContainer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface PersistentDataContainer**
`public interface PersistentDataContainer`
- `<P,C> void set(@NotNull NamespacedKey key, @NotNull PersistentDataType<P,C> type, @NotNull C value)`
- `<P,C> boolean has(@NotNull NamespacedKey key, @NotNull PersistentDataType<P,C> type)`
- `boolean has(@NotNull NamespacedKey key)`
- `@Nullable <P,C> C get(@NotNull NamespacedKey key, @NotNull PersistentDataType<P,C> type)`
- `@NotNull <P,C> C getOrDefault(@NotNull NamespacedKey key, @NotNull PersistentDataType<P,C> type, @NotNull C defaultValue)`
- `@NotNull Set<NamespacedKey> getKeys()`
- `void remove(@NotNull NamespacedKey key)`
- `boolean isEmpty()`
- `void copyTo(@NotNull PersistentDataContainer other, boolean replace)`
- `@NotNull PersistentDataAdapterContext getAdapterContext()`
