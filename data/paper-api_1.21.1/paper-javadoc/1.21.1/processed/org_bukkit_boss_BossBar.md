---
title: "org.bukkit.boss.BossBar"
package: "org.bukkit.boss"
source: https://jd.papermc.io/paper/1.21.1/org/bukkit/boss/BossBar.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:53.899Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
---

- `@NotNull @NotNull String getTitle()`
- `void setTitle(@Nullable @Nullable String title)`
- `@NotNull @NotNull BarColor getColor()`
- `void setColor(@NotNull @NotNull BarColor color)`
- `@NotNull @NotNull BarStyle getStyle()`
- `void setStyle(@NotNull @NotNull BarStyle style)`
- `void removeFlag(@NotNull @NotNull BarFlag flag)`
- `void addFlag(@NotNull @NotNull BarFlag flag)`
- `boolean hasFlag(@NotNull @NotNull BarFlag flag)`
- `void setProgress(double progress)`
- `double getProgress()`
- `void addPlayer(@NotNull @NotNull Player player)`
- `void removePlayer(@NotNull @NotNull Player player)`
- `void removeAll()`
- `@NotNull @NotNull List<Player> getPlayers()`
- `void setVisible(boolean visible)`
- `boolean isVisible()`
- `@Deprecated void show()`
- `@Deprecated void hide()`
