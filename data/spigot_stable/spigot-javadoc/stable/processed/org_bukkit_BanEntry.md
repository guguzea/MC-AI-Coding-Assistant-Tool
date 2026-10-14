---
title: "org.bukkit.BanEntry"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/BanEntry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T07:16:14.361Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface BanEntry<T>**
`public interface BanEntry<T>`
- `@Deprecated(since="1.20.1") @NotNull String getTarget()`
- `@NotNull T getBanTarget()`
- `@NotNull Date getCreated()`
- `void setCreated(@NotNull Date created)`
- `@NotNull String getSource()`
- `void setSource(@NotNull String source)`
- `@Nullable Date getExpiration()`
- `void setExpiration(@Nullable Date expiration)`
- `@Nullable String getReason()`
- `void setReason(@Nullable String reason)`
- `void save()`
- `void remove()`
