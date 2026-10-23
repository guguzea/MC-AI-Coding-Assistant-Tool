---
title: "org.bukkit.BanList"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/BanList.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Nullable @Nullable BanEntry getBanEntry&#8203;(@NotNull @NotNull String target)`
- `@Nullable @Nullable BanEntry addBan&#8203;(@NotNull @NotNull String target, @Nullable @Nullable String reason, @Nullable @Nullable Date expires, @Nullable @Nullable String source)`
- `@NotNull @NotNull Set<BanEntry> getBanEntries()`
- `boolean isBanned&#8203;(@NotNull @NotNull String target)`
- `void pardon&#8203;(@NotNull @NotNull String target)`
