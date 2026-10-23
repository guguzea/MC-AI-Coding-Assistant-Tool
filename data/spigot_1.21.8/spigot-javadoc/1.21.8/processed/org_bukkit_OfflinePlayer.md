---
title: "org.bukkit.OfflinePlayer"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.OfflinePlayer extends org.bukkit.permissions.ServerOperator,org.bukkit.entity.AnimalTamer,org.bukkit.configuration.serialization.ConfigurationSerializable`
- `public abstract boolean isOnline()`
- `public abstract java.lang.String getName()`
- `public abstract java.util.UUID getUniqueId()`
- `public abstract org.bukkit.profile.PlayerProfile getPlayerProfile()`
- `public abstract boolean isBanned()`
- `public abstract org.bukkit.BanEntry<org.bukkit.profile.PlayerProfile> ban(java.lang.String, java.util.Date, java.lang.String)`
- `public abstract org.bukkit.BanEntry<org.bukkit.profile.PlayerProfile> ban(java.lang.String, java.time.Instant, java.lang.String)`
- `public abstract org.bukkit.BanEntry<org.bukkit.profile.PlayerProfile> ban(java.lang.String, java.time.Duration, java.lang.String)`
- `public abstract boolean isWhitelisted()`
- `public abstract void setWhitelisted(boolean)`
- `public abstract org.bukkit.entity.Player getPlayer()`
- `public abstract long getFirstPlayed()`
- `public abstract long getLastPlayed()`
- `public abstract boolean hasPlayedBefore()`
- `public abstract org.bukkit.Location getBedSpawnLocation()`
- `public abstract org.bukkit.Location getRespawnLocation()`
- `public abstract void incrementStatistic(org.bukkit.Statistic) throws java.lang.IllegalArgumentException`
- `public abstract void decrementStatistic(org.bukkit.Statistic) throws java.lang.IllegalArgumentException`
- `public abstract void incrementStatistic(org.bukkit.Statistic, int) throws java.lang.IllegalArgumentException`
- `public abstract void decrementStatistic(org.bukkit.Statistic, int) throws java.lang.IllegalArgumentException`
- `public abstract void setStatistic(org.bukkit.Statistic, int) throws java.lang.IllegalArgumentException`
- `public abstract int getStatistic(org.bukkit.Statistic) throws java.lang.IllegalArgumentException`
- `public abstract void incrementStatistic(org.bukkit.Statistic, org.bukkit.Material) throws java.lang.IllegalArgumentException`
- `public abstract void decrementStatistic(org.bukkit.Statistic, org.bukkit.Material) throws java.lang.IllegalArgumentException`
- `public abstract int getStatistic(org.bukkit.Statistic, org.bukkit.Material) throws java.lang.IllegalArgumentException`
- `public abstract void incrementStatistic(org.bukkit.Statistic, org.bukkit.Material, int) throws java.lang.IllegalArgumentException`
- `public abstract void decrementStatistic(org.bukkit.Statistic, org.bukkit.Material, int) throws java.lang.IllegalArgumentException`
- `public abstract void setStatistic(org.bukkit.Statistic, org.bukkit.Material, int) throws java.lang.IllegalArgumentException`
- `public abstract void incrementStatistic(org.bukkit.Statistic, org.bukkit.entity.EntityType) throws java.lang.IllegalArgumentException`
- `public abstract void decrementStatistic(org.bukkit.Statistic, org.bukkit.entity.EntityType) throws java.lang.IllegalArgumentException`
- `public abstract int getStatistic(org.bukkit.Statistic, org.bukkit.entity.EntityType) throws java.lang.IllegalArgumentException`
- `public abstract void incrementStatistic(org.bukkit.Statistic, org.bukkit.entity.EntityType, int) throws java.lang.IllegalArgumentException`
- `public abstract void decrementStatistic(org.bukkit.Statistic, org.bukkit.entity.EntityType, int)`
- `public abstract void setStatistic(org.bukkit.Statistic, org.bukkit.entity.EntityType, int)`
- `public abstract org.bukkit.Location getLastDeathLocation()`
- `public abstract org.bukkit.Location getLocation()`
