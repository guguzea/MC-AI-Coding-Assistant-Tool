---
title: "io.papermc.paper.persistence.PersistentDataContainerView"
package: "io.papermc.paper.persistence"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/persistence/PersistentDataContainerView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PersistentDataContainerView**
`@NullMarked @NonExtendable public interface PersistentDataContainerView`
- `<P,C> boolean has(NamespacedKey key, PersistentDataType<P,C> type)`
- `boolean has(NamespacedKey key)`
- `default boolean has(PersistentDataKey<?> dataKey)`
- `<P,C> @Nullable C get(NamespacedKey key, PersistentDataType<P,C> type)`
- `<P,C> C getOrDefault(NamespacedKey key, PersistentDataType<P,C> type, C defaultValue)`
- `default <C> @Nullable C get(PersistentDataKey<C> dataKey)`
- `default <C> C getOrDefault(PersistentDataKey<C> dataKey, C defaultValue)`
- `Set<NamespacedKey> getKeys()`
- `boolean isEmpty()`
- `void copyTo(PersistentDataContainer other, boolean replace)`
- `PersistentDataAdapterContext getAdapterContext()`
- `byte[] serializeToBytes() throws IOException`
- `int getSize()`
