---
title: "org.bukkit.BanList"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/BanList.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@Deprecated @Nullable <E extends BanEntry<? super T>> E getBanEntry(@NotNull @NotNull String target)`
- `@Nullable @Nullable BanEntry<T> getBanEntry(@NotNull T target)`
- `@Deprecated @Nullable <E extends BanEntry<? super T>> E addBan(@NotNull @NotNull String target, @Nullable @Nullable String reason, @Nullable @Nullable Date expires, @Nullable @Nullable String source)`
- `@Nullable @Nullable BanEntry<T> addBan(@NotNull T target, @Nullable @Nullable String reason, @Nullable @Nullable Date expires, @Nullable @Nullable String source)`
- `@Nullable @Nullable BanEntry<T> addBan(@NotNull T target, @Nullable @Nullable String reason, @Nullable @Nullable Instant expires, @Nullable @Nullable String source)`
- `@Nullable @Nullable BanEntry<T> addBan(@NotNull T target, @Nullable @Nullable String reason, @Nullable @Nullable Duration duration, @Nullable @Nullable String source)`
- `@Deprecated @NotNull @NotNull Set<BanEntry> getBanEntries()`
- `@NotNull <E extends BanEntry<? super T>> @NotNull Set<E> getEntries()`
- `boolean isBanned(@NotNull T target)`
- `@Deprecated boolean isBanned(@NotNull @NotNull String target)`
- `void pardon(@NotNull T target)`
- `@Deprecated void pardon(@NotNull @NotNull String target)`
