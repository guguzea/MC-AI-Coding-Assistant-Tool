---
title: "com.destroystokyo.paper.Title"
package: "com.destroystokyo.paper"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/Title.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class Title**
`@Deprecated(since="1.16.5") public final class Title extends Object`
- `public static final int DEFAULT_FADE_IN`
- `public static final int DEFAULT_STAY`
- `public static final int DEFAULT_FADE_OUT`
- `public Title(@NotNull @NotNull net.md_5.bungee.api.chat.BaseComponent title)`
- `public Title(@NotNull @NotNull net.md_5.bungee.api.chat.BaseComponent[] title)`
- `public Title(@NotNull @NotNull String title)`
- `public Title(@NotNull @NotNull net.md_5.bungee.api.chat.BaseComponent title, @Nullable @Nullable net.md_5.bungee.api.chat.BaseComponent subtitle)`
- `public Title(@NotNull @NotNull net.md_5.bungee.api.chat.BaseComponent[] title, @Nullable @Nullable net.md_5.bungee.api.chat.BaseComponent[] subtitle)`
- `public Title(@NotNull @NotNull String title, @Nullable @Nullable String subtitle)`
- `public Title(@NotNull @NotNull net.md_5.bungee.api.chat.BaseComponent title, @Nullable @Nullable net.md_5.bungee.api.chat.BaseComponent subtitle, int fadeIn, int stay, int fadeOut)`
- `public Title(@Nullable @Nullable net.md_5.bungee.api.chat.BaseComponent[] title, @NotNull @NotNull net.md_5.bungee.api.chat.BaseComponent[] subtitle, int fadeIn, int stay, int fadeOut)`
- `public Title(@NotNull @NotNull String title, @Nullable @Nullable String subtitle, int fadeIn, int stay, int fadeOut)`
- `@NotNull public @NotNull net.md_5.bungee.api.chat.BaseComponent[] getTitle()`
- `@Nullable public @Nullable net.md_5.bungee.api.chat.BaseComponent[] getSubtitle()`
- `public int getFadeIn()`
- `public int getStay()`
- `public int getFadeOut()`
- `public void send(@NotNull @NotNull Player player)`
- `public void send(@NotNull @NotNull Collection<? extends Player> players)`
- `public void send(@NotNull @NotNull Player[] players)`
- `public void broadcast()`
- `@NotNull public static @NotNull Title.Builder builder()`
