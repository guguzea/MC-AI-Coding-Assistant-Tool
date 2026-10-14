---
title: "org.bukkit.event.player.PlayerAdvancementDoneEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerAdvancementDoneEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerAdvancementDoneEvent**
`public class PlayerAdvancementDoneEvent extends PlayerEvent`
- `@Internal @Deprecated(since="1.21.5", forRemoval=true) public PlayerAdvancementDoneEvent(@NotNull @NotNull Player player, @NotNull @NotNull Advancement advancement)`
- `@Internal public PlayerAdvancementDoneEvent(@NotNull @NotNull Player player, @NotNull @NotNull Advancement advancement, @Nullable @Nullable Component message)`
- `@NotNull public @NotNull Advancement getAdvancement()`
- `@Nullable public @Nullable Component message()`
- `public void message(@Nullable @Nullable Component message)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
