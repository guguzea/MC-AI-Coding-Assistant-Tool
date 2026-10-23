---
title: "org.bukkit.ban.ProfileBanList"
package: "org.bukkit.ban"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/ban/ProfileBanList.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Nullable @Deprecated <E extends BanEntry<? super PlayerProfile>> E addBan(@NotNull @NotNull PlayerProfile target, @Nullable @Nullable String reason, @Nullable @Nullable Date expires, @Nullable @Nullable String source)`
- `@Nullable @Nullable BanEntry<PlayerProfile> addBan(@NotNull PlayerProfile target, @Nullable @Nullable String reason, @Nullable @Nullable Date expires, @Nullable @Nullable String source)`
- `@Deprecated @Nullable <E extends BanEntry<? super PlayerProfile>> E getBanEntry(@NotNull @NotNull PlayerProfile target)`
- `@Deprecated boolean isBanned(@NotNull @NotNull PlayerProfile target)`
- `@Deprecated void pardon(@NotNull @NotNull PlayerProfile target)`
- `@Deprecated @Nullable <E extends BanEntry<? super PlayerProfile>> E addBan(@NotNull @NotNull PlayerProfile target, @Nullable @Nullable String reason, @Nullable Instant expires, @Nullable @Nullable String source)`
- `@Deprecated @Nullable <E extends BanEntry<? super PlayerProfile>> E addBan(@NotNull @NotNull PlayerProfile target, @Nullable @Nullable String reason, @Nullable Duration duration, @Nullable @Nullable String source)`
