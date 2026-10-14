---
title: "org.bukkit.event.player.PlayerExpCooldownChangeEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerExpCooldownChangeEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerExpCooldownChangeEvent**
`public class PlayerExpCooldownChangeEvent extends PlayerEvent`
- `@Internal public PlayerExpCooldownChangeEvent(@NotNull @NotNull Player player, int newCooldown, @NotNull @NotNull PlayerExpCooldownChangeEvent.ChangeReason reason)`
- `@NotNull public @NotNull PlayerExpCooldownChangeEvent.ChangeReason getReason()`
- `public int getNewCooldown()`
- `public void setNewCooldown(int newCooldown)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
