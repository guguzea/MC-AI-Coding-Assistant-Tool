---
title: "org.bukkit.event.player.PlayerEggThrowEvent"
package: "org.bukkit.event.player"
source: https://jd.papermc.io/paper/26.3/org/bukkit/event/player/PlayerEggThrowEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class PlayerEggThrowEvent**
`public class PlayerEggThrowEvent extends PlayerEvent`
- `@Internal public PlayerEggThrowEvent(@NotNull @NotNull Player player, @NotNull @NotNull Egg egg, boolean hatching, byte numHatches, @NotNull @NotNull EntityType hatchingType)`
- `@NotNull public @NotNull Egg getEgg()`
- `public boolean isHatching()`
- `public void setHatching(boolean hatching)`
- `@NotNull public @NotNull EntityType getHatchingType()`
- `public void setHatchingType(@NotNull @NotNull EntityType hatchType)`
- `public byte getNumHatches()`
- `public void setNumHatches(byte numHatches)`
- `@NotNull public @NotNull HandlerList getHandlers()`
- `@NotNull public static @NotNull HandlerList getHandlerList()`
