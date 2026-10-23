---
title: "org.bukkit.scoreboard.Team"
package: "org.bukkit.scoreboard"
source: https://jd.papermc.io/paper/1.16.5/org/bukkit/scoreboard/Team.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull String getName() throws IllegalStateException`
- `@NotNull Component displayName() throws IllegalStateException`
- `void displayName&#8203;(@Nullable Component displayName) throws IllegalStateException, IllegalArgumentException`
- `@NotNull Component prefix() throws IllegalStateException`
- `void prefix&#8203;(@Nullable Component prefix) throws IllegalStateException, IllegalArgumentException`
- `@NotNull Component suffix() throws IllegalStateException`
- `void suffix&#8203;(@Nullable Component suffix) throws IllegalStateException, IllegalArgumentException`
- `@NotNull TextColor color() throws IllegalStateException`
- `void color&#8203;(@Nullable NamedTextColor color)`
- `@NotNull @Deprecated @NotNull String getDisplayName() throws IllegalStateException`
- `@Deprecated void setDisplayName&#8203;(@NotNull @NotNull String displayName) throws IllegalStateException, IllegalArgumentException`
- `@NotNull @Deprecated @NotNull String getPrefix() throws IllegalStateException`
- `@Deprecated void setPrefix&#8203;(@NotNull @NotNull String prefix) throws IllegalStateException, IllegalArgumentException`
- `@NotNull @Deprecated @NotNull String getSuffix() throws IllegalStateException`
- `@Deprecated void setSuffix&#8203;(@NotNull @NotNull String suffix) throws IllegalStateException, IllegalArgumentException`
- `@NotNull @Deprecated @NotNull ChatColor getColor() throws IllegalStateException`
- `@Deprecated void setColor&#8203;(@NotNull @NotNull ChatColor color)`
- `boolean allowFriendlyFire() throws IllegalStateException`
- `void setAllowFriendlyFire&#8203;(boolean enabled) throws IllegalStateException`
- `boolean canSeeFriendlyInvisibles() throws IllegalStateException`
- `void setCanSeeFriendlyInvisibles&#8203;(boolean enabled) throws IllegalStateException`
- `@Deprecated @NotNull @NotNull NameTagVisibility getNameTagVisibility() throws IllegalArgumentException`
- `@Deprecated void setNameTagVisibility&#8203;(@NotNull @NotNull NameTagVisibility visibility) throws IllegalArgumentException`
- `@Deprecated @NotNull @NotNull Set<OfflinePlayer> getPlayers() throws IllegalStateException`
- `@NotNull @NotNull Set<String> getEntries() throws IllegalStateException`
- `int getSize() throws IllegalStateException`
- `@Nullable @Nullable Scoreboard getScoreboard()`
- `@Deprecated void addPlayer&#8203;(@NotNull @NotNull OfflinePlayer player) throws IllegalStateException, IllegalArgumentException`
- `void addEntry&#8203;(@NotNull @NotNull String entry) throws IllegalStateException, IllegalArgumentException`
- `@Deprecated boolean removePlayer&#8203;(@NotNull @NotNull OfflinePlayer player) throws IllegalStateException, IllegalArgumentException`
- `boolean removeEntry&#8203;(@NotNull @NotNull String entry) throws IllegalStateException, IllegalArgumentException`
- `void unregister() throws IllegalStateException`
- `@Deprecated boolean hasPlayer&#8203;(@NotNull @NotNull OfflinePlayer player) throws IllegalArgumentException, IllegalStateException`
- `boolean hasEntry&#8203;(@NotNull @NotNull String entry) throws IllegalArgumentException, IllegalStateException`
- `@NotNull @NotNull Team.OptionStatus getOption&#8203;(@NotNull @NotNull Team.Option option) throws IllegalStateException`
- `void setOption&#8203;(@NotNull @NotNull Team.Option option, @NotNull @NotNull Team.OptionStatus status) throws IllegalStateException`
