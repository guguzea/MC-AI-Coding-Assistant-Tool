---
title: "org.bukkit.persistence.PersistentDataContainer"
package: "org.bukkit.persistence"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/persistence/PersistentDataContainer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `<P, C> void set(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull PersistentDataType<P,C> type, @NotNull C value)`
- `void remove(@NotNull @NotNull NamespacedKey key)`
- `void readFromBytes(byte @NotNull [] bytes, boolean clear) throws IOException`
- `default void readFromBytes(byte @NotNull [] bytes) throws IOException`
