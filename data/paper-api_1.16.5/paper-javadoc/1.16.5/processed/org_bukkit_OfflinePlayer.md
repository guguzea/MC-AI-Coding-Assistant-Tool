---
title: "org.bukkit.OfflinePlayer"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/OfflinePlayer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `boolean isOnline()`
- `@Nullable @Nullable String getName()`
- `@NotNull @NotNull UUID getUniqueId()`
- `boolean isBanned()`
- `@NotNull default @NotNull BanEntry banPlayer&#8203;(@Nullable @Nullable String reason)`
- `@NotNull default @NotNull BanEntry banPlayer&#8203;(@Nullable @Nullable String reason, @Nullable @Nullable String source)`
- `@NotNull default @NotNull BanEntry banPlayer&#8203;(@Nullable @Nullable String reason, @Nullable Date expires)`
- `@NotNull default @NotNull BanEntry banPlayer&#8203;(@Nullable @Nullable String reason, @Nullable Date expires, @Nullable @Nullable String source)`
- `@NotNull default @NotNull BanEntry banPlayer&#8203;(@Nullable @Nullable String reason, @Nullable Date expires, @Nullable @Nullable String source, boolean kickIfOnline)`
- `boolean isWhitelisted()`
- `void setWhitelisted&#8203;(boolean value)`
- `@Nullable @Nullable Player getPlayer()`
- `long getFirstPlayed()`
- `@Deprecated long getLastPlayed()`
- `boolean hasPlayedBefore()`
- `@Nullable @Nullable Location getBedSpawnLocation()`
- `long getLastLogin()`
- `long getLastSeen()`
- `void incrementStatistic&#8203;(@NotNull @NotNull Statistic statistic) throws IllegalArgumentException`
- `void decrementStatistic&#8203;(@NotNull @NotNull Statistic statistic) throws IllegalArgumentException`
- `void incrementStatistic&#8203;(@NotNull @NotNull Statistic statistic, int amount) throws IllegalArgumentException`
- `void decrementStatistic&#8203;(@NotNull @NotNull Statistic statistic, int amount) throws IllegalArgumentException`
- `void setStatistic&#8203;(@NotNull @NotNull Statistic statistic, int newValue) throws IllegalArgumentException`
- `int getStatistic&#8203;(@NotNull @NotNull Statistic statistic) throws IllegalArgumentException`
- `void incrementStatistic&#8203;(@NotNull @NotNull Statistic statistic, @NotNull @NotNull Material material) throws IllegalArgumentException`
- `void decrementStatistic&#8203;(@NotNull @NotNull Statistic statistic, @NotNull @NotNull Material material) throws IllegalArgumentException`
- `int getStatistic&#8203;(@NotNull @NotNull Statistic statistic, @NotNull @NotNull Material material) throws IllegalArgumentException`
- `void incrementStatistic&#8203;(@NotNull @NotNull Statistic statistic, @NotNull @NotNull Material material, int amount) throws IllegalArgumentException`
- `void decrementStatistic&#8203;(@NotNull @NotNull Statistic statistic, @NotNull @NotNull Material material, int amount) throws IllegalArgumentException`
- `void setStatistic&#8203;(@NotNull @NotNull Statistic statistic, @NotNull @NotNull Material material, int newValue) throws IllegalArgumentException`
- `void incrementStatistic&#8203;(@NotNull @NotNull Statistic statistic, @NotNull @NotNull EntityType entityType) throws IllegalArgumentException`
- `void decrementStatistic&#8203;(@NotNull @NotNull Statistic statistic, @NotNull @NotNull EntityType entityType) throws IllegalArgumentException`
- `int getStatistic&#8203;(@NotNull @NotNull Statistic statistic, @NotNull @NotNull EntityType entityType) throws IllegalArgumentException`
- `void incrementStatistic&#8203;(@NotNull @NotNull Statistic statistic, @NotNull @NotNull EntityType entityType, int amount) throws IllegalArgumentException`
- `void decrementStatistic&#8203;(@NotNull @NotNull Statistic statistic, @NotNull @NotNull EntityType entityType, int amount)`
- `void setStatistic&#8203;(@NotNull @NotNull Statistic statistic, @NotNull @NotNull EntityType entityType, int newValue)`
