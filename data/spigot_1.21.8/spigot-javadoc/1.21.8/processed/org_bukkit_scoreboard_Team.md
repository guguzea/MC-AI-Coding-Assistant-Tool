---
title: "org.bukkit.scoreboard.Team"
package: "org.bukkit.scoreboard"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.8-R0.1-SNAPSHOT/spigot-api-1.21.8-R0.1-20250930.150928-11.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:58:53.605Z
asOfVersion: "1.21.8-R0.1-SNAPSHOT"
jarMd5: "b5fa33feaafaaf08dccdb2999aeff20e"
---

- `public interface org.bukkit.scoreboard.Team`
- `public abstract java.lang.String getName()`
- `public abstract java.lang.String getDisplayName()`
- `public abstract void setDisplayName(java.lang.String)`
- `public abstract java.lang.String getPrefix()`
- `public abstract void setPrefix(java.lang.String)`
- `public abstract java.lang.String getSuffix()`
- `public abstract void setSuffix(java.lang.String)`
- `public abstract org.bukkit.ChatColor getColor()`
- `public abstract void setColor(org.bukkit.ChatColor)`
- `public abstract boolean allowFriendlyFire()`
- `public abstract void setAllowFriendlyFire(boolean)`
- `public abstract boolean canSeeFriendlyInvisibles()`
- `public abstract void setCanSeeFriendlyInvisibles(boolean)`
- `public abstract org.bukkit.scoreboard.NameTagVisibility getNameTagVisibility()`
- `public abstract void setNameTagVisibility(org.bukkit.scoreboard.NameTagVisibility)`
- `public abstract java.util.Set<org.bukkit.OfflinePlayer> getPlayers()`
- `public abstract java.util.Set<java.lang.String> getEntries()`
- `public abstract int getSize()`
- `public abstract org.bukkit.scoreboard.Scoreboard getScoreboard()`
- `public abstract void addPlayer(org.bukkit.OfflinePlayer)`
- `public abstract void addEntry(java.lang.String)`
- `public abstract boolean removePlayer(org.bukkit.OfflinePlayer)`
- `public abstract boolean removeEntry(java.lang.String)`
- `public abstract void unregister()`
- `public abstract boolean hasPlayer(org.bukkit.OfflinePlayer)`
- `public abstract boolean hasEntry(java.lang.String)`
- `public abstract org.bukkit.scoreboard.Team$OptionStatus getOption(org.bukkit.scoreboard.Team$Option)`
- `public abstract void setOption(org.bukkit.scoreboard.Team$Option, org.bukkit.scoreboard.Team$OptionStatus)`
