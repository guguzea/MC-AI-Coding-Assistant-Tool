---
title: "org.bukkit.BanList"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/BanList.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface BanList<T>**
`public interface BanList<T>`
- `@Deprecated(since="1.20.1") @Nullable BanEntry<T> getBanEntry(@NotNull String target)`
- `@Nullable BanEntry<T> getBanEntry(@NotNull T target)`
- `@Deprecated(since="1.20.1") @Nullable BanEntry<T> addBan(@NotNull String target, @Nullable String reason, @Nullable Date expires, @Nullable String source)`
- `@Nullable BanEntry<T> addBan(@NotNull T target, @Nullable String reason, @Nullable Date expires, @Nullable String source)`
- `@Nullable BanEntry<T> addBan(@NotNull T target, @Nullable String reason, @Nullable Instant expires, @Nullable String source)`
- `@Nullable BanEntry<T> addBan(@NotNull T target, @Nullable String reason, @Nullable Duration duration, @Nullable String source)`
- `@Deprecated(since="1.20.1") @NotNull Set<BanEntry> getBanEntries()`
- `@NotNull Set<BanEntry<T>> getEntries()`
- `boolean isBanned(@NotNull T target)`
- `@Deprecated(since="1.20.1") boolean isBanned(@NotNull String target)`
- `void pardon(@NotNull T target)`
- `@Deprecated(since="1.20.1") void pardon(@NotNull String target)`
