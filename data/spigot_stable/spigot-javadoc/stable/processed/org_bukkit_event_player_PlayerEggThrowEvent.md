---
title: "org.bukkit.event.player.PlayerEggThrowEvent"
package: "org.bukkit.event.player"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/player/PlayerEggThrowEvent.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class PlayerEggThrowEvent**
`public class PlayerEggThrowEvent extends PlayerEvent`
- `public PlayerEggThrowEvent(@NotNull Player player, @NotNull Egg egg, boolean hatching, byte numHatches, @NotNull EntityType hatchingType)`
- `@NotNull public Egg getEgg()`
- `public boolean isHatching()`
- `public void setHatching(boolean hatching)`
- `@NotNull public EntityType getHatchingType()`
- `public void setHatchingType(@NotNull EntityType hatchType)`
- `public byte getNumHatches()`
- `public void setNumHatches(byte numHatches)`
- `@NotNull public HandlerList getHandlers()`
- `@NotNull public static HandlerList getHandlerList()`
