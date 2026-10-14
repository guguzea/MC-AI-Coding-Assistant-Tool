---
title: "org.bukkit.event.player.PlayerExpChangeEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerExpChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerExpChangeEvent**
`public class PlayerExpChangeEvent extends PlayerEvent`
- `@Internal public PlayerExpChangeEvent(@NotNull @NotNull Player player, int expAmount)`
- `@Internal public PlayerExpChangeEvent(@NotNull @NotNull Player player, @Nullable @Nullable Entity sourceEntity, int expAmount)`
- `@Nullable public @Nullable Entity getSource()`
- `public int getAmount()`
- `public void setAmount(int amount)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
