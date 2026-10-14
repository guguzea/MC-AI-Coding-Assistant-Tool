---
title: "org.bukkit.scoreboard.Team"
package: "org.bukkit.scoreboard"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/scoreboard/Team.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Team**
`public interface Team`
- `@NotNull String getName()`
- `@NotNull String getDisplayName()`
- `void setDisplayName(@NotNull String displayName)`
- `@NotNull String getPrefix()`
- `void setPrefix(@NotNull String prefix)`
- `@NotNull String getSuffix()`
- `void setSuffix(@NotNull String suffix)`
- `@NotNull ChatColor getColor()`
- `void setColor(@NotNull ChatColor color)`
- `boolean allowFriendlyFire()`
- `void setAllowFriendlyFire(boolean enabled)`
- `boolean canSeeFriendlyInvisibles()`
- `void setCanSeeFriendlyInvisibles(boolean enabled)`
- `@Deprecated(since="1.9") @NotNull NameTagVisibility getNameTagVisibility()`
- `@Deprecated(since="1.9") void setNameTagVisibility(@NotNull NameTagVisibility visibility)`
- `@Deprecated(since="1.8.6") @NotNull Set<OfflinePlayer> getPlayers()`
- `@NotNull Set<String> getEntries()`
- `int getSize()`
- `@Nullable Scoreboard getScoreboard()`
- `@Deprecated(since="1.8.6") void addPlayer(@NotNull OfflinePlayer player)`
- `void addEntry(@NotNull String entry)`
- `@Deprecated(since="1.8.6") boolean removePlayer(@NotNull OfflinePlayer player)`
- `boolean removeEntry(@NotNull String entry)`
- `void unregister()`
- `@Deprecated(since="1.8.6") boolean hasPlayer(@NotNull OfflinePlayer player)`
- `boolean hasEntry(@NotNull String entry)`
- `@NotNull Team.OptionStatus getOption(@NotNull Team.Option option)`
- `void setOption(@NotNull Team.Option option, @NotNull Team.OptionStatus status)`
