---
title: "org.bukkit.OfflinePlayer"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/OfflinePlayer.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface OfflinePlayer**
`public interface OfflinePlayer extends ServerOperator, AnimalTamer, ConfigurationSerializable`
- `boolean isOnline()`
- `@Nullable String getName()`
- `@NotNull UUID getUniqueId()`
- `@NotNull PlayerProfile getPlayerProfile()`
- `boolean isBanned()`
- `@Nullable BanEntry<PlayerProfile> ban(@Nullable String reason, @Nullable Date expires, @Nullable String source)`
- `@Nullable BanEntry<PlayerProfile> ban(@Nullable String reason, @Nullable Instant expires, @Nullable String source)`
- `@Nullable BanEntry<PlayerProfile> ban(@Nullable String reason, @Nullable Duration duration, @Nullable String source)`
- `boolean isWhitelisted()`
- `void setWhitelisted(boolean value)`
- `@Nullable Player getPlayer()`
- `long getFirstPlayed()`
- `long getLastPlayed()`
- `boolean hasPlayedBefore()`
- `@Nullable @Deprecated(since="1.20.4") Location getBedSpawnLocation()`
- `@Nullable Location getRespawnLocation()`
- `void incrementStatistic(@NotNull Statistic statistic) throws IllegalArgumentException`
- `void decrementStatistic(@NotNull Statistic statistic) throws IllegalArgumentException`
- `void incrementStatistic(@NotNull Statistic statistic, int amount) throws IllegalArgumentException`
- `void decrementStatistic(@NotNull Statistic statistic, int amount) throws IllegalArgumentException`
- `void setStatistic(@NotNull Statistic statistic, int newValue) throws IllegalArgumentException`
- `int getStatistic(@NotNull Statistic statistic) throws IllegalArgumentException`
- `void incrementStatistic(@NotNull Statistic statistic, @NotNull Material material) throws IllegalArgumentException`
- `void decrementStatistic(@NotNull Statistic statistic, @NotNull Material material) throws IllegalArgumentException`
- `int getStatistic(@NotNull Statistic statistic, @NotNull Material material) throws IllegalArgumentException`
- `void incrementStatistic(@NotNull Statistic statistic, @NotNull Material material, int amount) throws IllegalArgumentException`
- `void decrementStatistic(@NotNull Statistic statistic, @NotNull Material material, int amount) throws IllegalArgumentException`
- `void setStatistic(@NotNull Statistic statistic, @NotNull Material material, int newValue) throws IllegalArgumentException`
- `void incrementStatistic(@NotNull Statistic statistic, @NotNull EntityType entityType) throws IllegalArgumentException`
- `void decrementStatistic(@NotNull Statistic statistic, @NotNull EntityType entityType) throws IllegalArgumentException`
- `int getStatistic(@NotNull Statistic statistic, @NotNull EntityType entityType) throws IllegalArgumentException`
- `void incrementStatistic(@NotNull Statistic statistic, @NotNull EntityType entityType, int amount) throws IllegalArgumentException`
- `void decrementStatistic(@NotNull Statistic statistic, @NotNull EntityType entityType, int amount)`
- `void setStatistic(@NotNull Statistic statistic, @NotNull EntityType entityType, int newValue)`
- `@Nullable Location getLastDeathLocation()`
- `@Nullable Location getLocation()`
