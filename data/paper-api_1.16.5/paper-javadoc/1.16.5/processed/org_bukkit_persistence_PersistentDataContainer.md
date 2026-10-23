---
title: "org.bukkit.persistence.PersistentDataContainer"
package: "org.bukkit.persistence"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/persistence/PersistentDataContainer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `<T,&#8203; Z> void set&#8203;(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull PersistentDataType<T,&#8203;Z> type, @NotNull Z value)`
- `<T,&#8203; Z> boolean has&#8203;(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull PersistentDataType<T,&#8203;Z> type)`
- `@Nullable <T,&#8203; Z> Z get&#8203;(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull PersistentDataType<T,&#8203;Z> type)`
- `@NotNull <T,&#8203; Z> Z getOrDefault&#8203;(@NotNull @NotNull NamespacedKey key, @NotNull @NotNull PersistentDataType<T,&#8203;Z> type, @NotNull Z defaultValue)`
- `@NotNull @NotNull Set<NamespacedKey> getKeys()`
- `void remove&#8203;(@NotNull @NotNull NamespacedKey key)`
- `boolean isEmpty()`
- `@NotNull @NotNull PersistentDataAdapterContext getAdapterContext()`
