---
title: "org.bukkit.GameMode"
package: "org.bukkit"
source: https://jd.papermc.io/paper/26.3/org/bukkit/GameMode.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Enum Class GameMode**
`public enum GameMode extends Enum<GameMode> implements Translatable`
- `public static final GameMode CREATIVE`
- `public static final GameMode SURVIVAL`
- `public static final GameMode ADVENTURE`
- `public static final GameMode SPECTATOR`
- `public static GameMode[] values()`
- `public static GameMode valueOf(String name)`
- `@NotNull public @NotNull String translationKey()`
- `@Internal public int getValue()`
- `@Internal @Nullable public static @Nullable GameMode getByValue(int value)`
- `public boolean isInvulnerable()`
