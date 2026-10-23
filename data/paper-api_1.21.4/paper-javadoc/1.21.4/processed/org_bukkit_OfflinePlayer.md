---
title: "org.bukkit.OfflinePlayer"
package: "org.bukkit"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/OfflinePlayer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `boolean isOnline()`
- `boolean isConnected()`
- `@Nullable String getName()`
- `UUID getUniqueId()`
- `PlayerProfile getPlayerProfile()`
- `boolean isBanned()`
- `@Deprecated(since="1.20.4") default BanEntry banPlayer(@Nullable String reason)`
- `@Deprecated(since="1.20.4") default BanEntry banPlayer(@Nullable String reason, @Nullable String source)`
- `@Deprecated(since="1.20.4") default BanEntry banPlayer(@Nullable String reason, @Nullable Date expires)`
- `@Deprecated(since="1.20.4") default BanEntry banPlayer(@Nullable String reason, @Nullable Date expires, @Nullable String source)`
- `@Deprecated(since="1.20.4") default BanEntry banPlayer(@Nullable String reason, @Nullable Date expires, @Nullable String source, boolean kickIfOnline)`
- `<E extends BanEntry<? super PlayerProfile>> @Nullable E ban(@Nullable String reason, @Nullable Date expires, @Nullable String source)`
- `<E extends BanEntry<? super PlayerProfile>> @Nullable E ban(@Nullable String reason, @Nullable Instant expires, @Nullable String source)`
- `<E extends BanEntry<? super PlayerProfile>> @Nullable E ban(@Nullable String reason, @Nullable Duration duration, @Nullable String source)`
- `boolean isWhitelisted()`
- `void setWhitelisted(boolean value)`
- `@Nullable Player getPlayer()`
- `long getFirstPlayed()`
- `@Deprecated long getLastPlayed()`
- `boolean hasPlayedBefore()`
- `@Deprecated(since="1.20.4") @Nullable Location getBedSpawnLocation()`
- `long getLastLogin()`
- `long getLastSeen()`
- `@Nullable Location getRespawnLocation()`
- `void incrementStatistic(Statistic statistic) throws IllegalArgumentException`
- `void decrementStatistic(Statistic statistic) throws IllegalArgumentException`
- `void incrementStatistic(Statistic statistic, int amount) throws IllegalArgumentException`
- `void decrementStatistic(Statistic statistic, int amount) throws IllegalArgumentException`
- `void setStatistic(Statistic statistic, int newValue) throws IllegalArgumentException`
- `int getStatistic(Statistic statistic) throws IllegalArgumentException`
- `void incrementStatistic(Statistic statistic, Material material) throws IllegalArgumentException`
- `void decrementStatistic(Statistic statistic, Material material) throws IllegalArgumentException`
- `int getStatistic(Statistic statistic, Material material) throws IllegalArgumentException`
- `void incrementStatistic(Statistic statistic, Material material, int amount) throws IllegalArgumentException`
- `void decrementStatistic(Statistic statistic, Material material, int amount) throws IllegalArgumentException`
- `void setStatistic(Statistic statistic, Material material, int newValue) throws IllegalArgumentException`
- `void incrementStatistic(Statistic statistic, EntityType entityType) throws IllegalArgumentException`
- `void decrementStatistic(Statistic statistic, EntityType entityType) throws IllegalArgumentException`
- `int getStatistic(Statistic statistic, EntityType entityType) throws IllegalArgumentException`
- `void incrementStatistic(Statistic statistic, EntityType entityType, int amount) throws IllegalArgumentException`
- `void decrementStatistic(Statistic statistic, EntityType entityType, int amount)`
- `void setStatistic(Statistic statistic, EntityType entityType, int newValue)`
- `@Nullable Location getLastDeathLocation()`
- `@Nullable Location getLocation()`
- `PersistentDataContainerView getPersistentDataContainer()`
