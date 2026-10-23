---
title: "io.papermc.paper.persistence.PersistentDataContainerView"
package: "io.papermc.paper.persistence"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/persistence/PersistentDataContainerView.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `<P, C> boolean has(NamespacedKey key, PersistentDataType<P,C> type)`
- `boolean has(NamespacedKey key)`
- `<P, C> @Nullable C get(NamespacedKey key, PersistentDataType<P,C> type)`
- `<P, C> C getOrDefault(NamespacedKey key, PersistentDataType<P,C> type, C defaultValue)`
- `Set<NamespacedKey> getKeys()`
- `boolean isEmpty()`
- `void copyTo(PersistentDataContainer other, boolean replace)`
- `PersistentDataAdapterContext getAdapterContext()`
- `byte[] serializeToBytes() throws IOException`
