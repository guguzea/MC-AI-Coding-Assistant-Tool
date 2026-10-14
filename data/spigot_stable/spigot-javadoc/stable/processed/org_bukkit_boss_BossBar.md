---
title: "org.bukkit.boss.BossBar"
package: "org.bukkit.boss"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/boss/BossBar.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface BossBar**
`public interface BossBar`
- `@NotNull String getTitle()`
- `void setTitle(@Nullable String title)`
- `@NotNull BarColor getColor()`
- `void setColor(@NotNull BarColor color)`
- `@NotNull BarStyle getStyle()`
- `void setStyle(@NotNull BarStyle style)`
- `void removeFlag(@NotNull BarFlag flag)`
- `void addFlag(@NotNull BarFlag flag)`
- `boolean hasFlag(@NotNull BarFlag flag)`
- `void setProgress(double progress)`
- `double getProgress()`
- `void addPlayer(@NotNull Player player)`
- `void removePlayer(@NotNull Player player)`
- `void removeAll()`
- `@NotNull List<Player> getPlayers()`
- `void setVisible(boolean visible)`
- `boolean isVisible()`
- `@Deprecated(since="1.9") void show()`
- `@Deprecated(since="1.9") void hide()`
