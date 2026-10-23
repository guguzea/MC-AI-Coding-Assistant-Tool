---
title: "org.bukkit.scoreboard.Team"
package: "org.bukkit.scoreboard"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.scoreboard.Team`
- `public abstract java.lang.String getName() throws java.lang.IllegalStateException`
- `public abstract java.lang.String getDisplayName() throws java.lang.IllegalStateException`
- `public abstract void setDisplayName(java.lang.String) throws java.lang.IllegalStateException, java.lang.IllegalArgumentException`
- `public abstract java.lang.String getPrefix() throws java.lang.IllegalStateException`
- `public abstract void setPrefix(java.lang.String) throws java.lang.IllegalStateException, java.lang.IllegalArgumentException`
- `public abstract java.lang.String getSuffix() throws java.lang.IllegalStateException`
- `public abstract void setSuffix(java.lang.String) throws java.lang.IllegalStateException, java.lang.IllegalArgumentException`
- `public abstract org.bukkit.ChatColor getColor() throws java.lang.IllegalStateException`
- `public abstract void setColor(org.bukkit.ChatColor)`
- `public abstract boolean allowFriendlyFire() throws java.lang.IllegalStateException`
- `public abstract void setAllowFriendlyFire(boolean) throws java.lang.IllegalStateException`
- `public abstract boolean canSeeFriendlyInvisibles() throws java.lang.IllegalStateException`
- `public abstract void setCanSeeFriendlyInvisibles(boolean) throws java.lang.IllegalStateException`
- `public abstract org.bukkit.scoreboard.NameTagVisibility getNameTagVisibility() throws java.lang.IllegalArgumentException`
- `public abstract void setNameTagVisibility(org.bukkit.scoreboard.NameTagVisibility) throws java.lang.IllegalArgumentException`
- `public abstract java.util.Set<org.bukkit.OfflinePlayer> getPlayers() throws java.lang.IllegalStateException`
- `public abstract java.util.Set<java.lang.String> getEntries() throws java.lang.IllegalStateException`
- `public abstract int getSize() throws java.lang.IllegalStateException`
- `public abstract org.bukkit.scoreboard.Scoreboard getScoreboard()`
- `public abstract void addPlayer(org.bukkit.OfflinePlayer) throws java.lang.IllegalStateException, java.lang.IllegalArgumentException`
- `public abstract void addEntry(java.lang.String) throws java.lang.IllegalStateException, java.lang.IllegalArgumentException`
- `public abstract boolean removePlayer(org.bukkit.OfflinePlayer) throws java.lang.IllegalStateException, java.lang.IllegalArgumentException`
- `public abstract boolean removeEntry(java.lang.String) throws java.lang.IllegalStateException, java.lang.IllegalArgumentException`
- `public abstract void unregister() throws java.lang.IllegalStateException`
- `public abstract boolean hasPlayer(org.bukkit.OfflinePlayer) throws java.lang.IllegalArgumentException, java.lang.IllegalStateException`
- `public abstract boolean hasEntry(java.lang.String) throws java.lang.IllegalArgumentException, java.lang.IllegalStateException`
- `public abstract org.bukkit.scoreboard.Team$OptionStatus getOption(org.bukkit.scoreboard.Team$Option) throws java.lang.IllegalStateException`
- `public abstract void setOption(org.bukkit.scoreboard.Team$Option, org.bukkit.scoreboard.Team$OptionStatus) throws java.lang.IllegalStateException`
