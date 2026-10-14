---
title: "org.bukkit.BanEntry"
package: "org.bukkit"
source: https://jd.papermc.io/paper/26.3/org/bukkit/BanEntry.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface BanEntry<T>**
`public interface BanEntry<T>`
- `@Deprecated(since="1.20.1") @NotNull @NotNull String getTarget()`
- `@NotNull T getBanTarget()`
- `@NotNull @NotNull Date getCreated()`
- `void setCreated(@NotNull @NotNull Date created)`
- `@NotNull @NotNull String getSource()`
- `void setSource(@NotNull @NotNull String source)`
- `@Nullable @Nullable Date getExpiration()`
- `void setExpiration(@Nullable @Nullable Date expiration)`
- `@Nullable @Nullable String getReason()`
- `void setReason(@Nullable @Nullable String reason)`
- `void save()`
- `void remove()`
