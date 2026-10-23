---
title: "org.bukkit.scoreboard.Team"
package: "org.bukkit.scoreboard"
source: https://jd.papermc.io/paper/1.21.4/org/bukkit/scoreboard/Team.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull String getName()`
- `@NotNull Component displayName()`
- `void displayName(@Nullable Component displayName)`
- `@NotNull Component prefix()`
- `void prefix(@Nullable Component prefix)`
- `@NotNull Component suffix()`
- `void suffix(@Nullable Component suffix)`
- `boolean hasColor()`
- `@NotNull TextColor color()`
- `void color(@Nullable NamedTextColor color)`
- `@NotNull @Deprecated @NotNull String getDisplayName()`
- `@Deprecated void setDisplayName(@NotNull @NotNull String displayName)`
- `@NotNull @Deprecated @NotNull String getPrefix()`
- `@Deprecated void setPrefix(@NotNull @NotNull String prefix)`
- `@NotNull @Deprecated @NotNull String getSuffix()`
- `@Deprecated void setSuffix(@NotNull @NotNull String suffix)`
- `@NotNull @Deprecated @NotNull ChatColor getColor()`
- `@Deprecated void setColor(@NotNull @NotNull ChatColor color)`
- `boolean allowFriendlyFire()`
- `void setAllowFriendlyFire(boolean enabled)`
- `boolean canSeeFriendlyInvisibles()`
- `void setCanSeeFriendlyInvisibles(boolean enabled)`
- `@Deprecated(since="1.9") @NotNull @NotNull NameTagVisibility getNameTagVisibility()`
- `@Deprecated(since="1.9") void setNameTagVisibility(@NotNull @NotNull NameTagVisibility visibility)`
- `@Deprecated(since="1.8.6") @NotNull @NotNull Set<OfflinePlayer> getPlayers()`
- `@NotNull @NotNull Set<String> getEntries()`
- `int getSize()`
- `@Nullable @Nullable Scoreboard getScoreboard()`
- `void addPlayer(@NotNull @NotNull OfflinePlayer player)`
- `void addEntry(@NotNull @NotNull String entry)`
- `default void addEntities(@NotNull Entity @NotNull ... entities)`
- `void addEntities(@NotNull Collection<Entity> entities) throws IllegalStateException, IllegalArgumentException`
- `default void addEntries(@NotNull @NotNull String... entries) throws IllegalStateException, IllegalArgumentException`
- `void addEntries(@NotNull Collection<String> entries) throws IllegalStateException, IllegalArgumentException`
- `boolean removePlayer(@NotNull @NotNull OfflinePlayer player)`
- `boolean removeEntry(@NotNull @NotNull String entry)`
- `default boolean removeEntities(@NotNull Entity @NotNull ... entities) throws IllegalStateException, IllegalArgumentException`
- `boolean removeEntities(@NotNull Collection<Entity> entities) throws IllegalStateException, IllegalArgumentException`
- `default boolean removeEntries(@NotNull @NotNull String... entries) throws IllegalStateException, IllegalArgumentException`
- `boolean removeEntries(@NotNull Collection<String> entries) throws IllegalStateException, IllegalArgumentException`
- `void unregister()`
- `boolean hasPlayer(@NotNull @NotNull OfflinePlayer player)`
- `boolean hasEntry(@NotNull @NotNull String entry)`
- `@NotNull @NotNull Team.OptionStatus getOption(@NotNull @NotNull Team.Option option)`
- `void setOption(@NotNull @NotNull Team.Option option, @NotNull @NotNull Team.OptionStatus status)`
- `void addEntity(@NotNull Entity entity) throws IllegalStateException, IllegalArgumentException`
- `boolean removeEntity(@NotNull Entity entity) throws IllegalStateException, IllegalArgumentException`
- `boolean hasEntity(@NotNull Entity entity) throws IllegalStateException, IllegalArgumentException`
