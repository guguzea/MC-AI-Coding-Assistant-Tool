---
title: "org.bukkit.OfflinePlayer"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.20.1/org/bukkit/OfflinePlayer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `boolean isOnline()`
- `boolean isConnected()`
- `@Nullable @Nullable String getName()`
- `@NotNull @NotNull UUID getUniqueId()`
- `@NotNull PlayerProfile getPlayerProfile()`
- `boolean isBanned()`
- `@NotNull default @NotNull BanEntry banPlayer(@Nullable @Nullable String reason)`
- `@NotNull default @NotNull BanEntry banPlayer(@Nullable @Nullable String reason, @Nullable @Nullable String source)`
- `@NotNull default @NotNull BanEntry banPlayer(@Nullable @Nullable String reason, @Nullable Date expires)`
- `@NotNull default @NotNull BanEntry banPlayer(@Nullable @Nullable String reason, @Nullable Date expires, @Nullable @Nullable String source)`
- `@NotNull default @NotNull BanEntry banPlayer(@Nullable @Nullable String reason, @Nullable Date expires, @Nullable @Nullable String source, boolean kickIfOnline)`
- `@Nullable <E extends BanEntry<? super PlayerProfile>> E ban(@Nullable @Nullable String reason, @Nullable @Nullable Date expires, @Nullable @Nullable String source)`
- `@Nullable <E extends BanEntry<? super PlayerProfile>> E ban(@Nullable @Nullable String reason, @Nullable @Nullable Instant expires, @Nullable @Nullable String source)`
- `@Nullable <E extends BanEntry<? super PlayerProfile>> E ban(@Nullable @Nullable String reason, @Nullable @Nullable Duration duration, @Nullable @Nullable String source)`
- `boolean isWhitelisted()`
- `void setWhitelisted(boolean value)`
- `@Nullable @Nullable Player getPlayer()`
- `long getFirstPlayed()`
- `@Deprecated long getLastPlayed()`
- `boolean hasPlayedBefore()`
- `@Nullable @Nullable Location getBedSpawnLocation()`
- `long getLastLogin()`
- `long getLastSeen()`
- `void incrementStatistic(@NotNull @NotNull Statistic statistic) throws IllegalArgumentException`
- `void decrementStatistic(@NotNull @NotNull Statistic statistic) throws IllegalArgumentException`
- `void incrementStatistic(@NotNull @NotNull Statistic statistic, int amount) throws IllegalArgumentException`
- `void decrementStatistic(@NotNull @NotNull Statistic statistic, int amount) throws IllegalArgumentException`
- `void setStatistic(@NotNull @NotNull Statistic statistic, int newValue) throws IllegalArgumentException`
- `int getStatistic(@NotNull @NotNull Statistic statistic) throws IllegalArgumentException`
- `void incrementStatistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull Material material) throws IllegalArgumentException`
- `void decrementStatistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull Material material) throws IllegalArgumentException`
- `int getStatistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull Material material) throws IllegalArgumentException`
- `void incrementStatistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull Material material, int amount) throws IllegalArgumentException`
- `void decrementStatistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull Material material, int amount) throws IllegalArgumentException`
- `void setStatistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull Material material, int newValue) throws IllegalArgumentException`
- `void incrementStatistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull EntityType entityType) throws IllegalArgumentException`
- `void decrementStatistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull EntityType entityType) throws IllegalArgumentException`
- `int getStatistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull EntityType entityType) throws IllegalArgumentException`
- `void incrementStatistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull EntityType entityType, int amount) throws IllegalArgumentException`
- `void decrementStatistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull EntityType entityType, int amount)`
- `void setStatistic(@NotNull @NotNull Statistic statistic, @NotNull @NotNull EntityType entityType, int newValue)`
- `@Nullable @Nullable Location getLastDeathLocation()`
