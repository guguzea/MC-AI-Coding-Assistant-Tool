---
title: "org.bukkit.OfflinePlayer"
package: "org.bukkit"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.20.1-R0.1-SNAPSHOT/spigot-api-1.20.1-R0.1-20230921.163938-66.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:33:20.138Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
jarMd5: "1eba255bc0360c0286ee840906c6095c"
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
