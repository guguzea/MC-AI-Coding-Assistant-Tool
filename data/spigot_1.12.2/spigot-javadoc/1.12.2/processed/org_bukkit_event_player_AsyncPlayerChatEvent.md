---
title: "org.bukkit.event.player.AsyncPlayerChatEvent"
package: "org.bukkit.event.player"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public class org.bukkit.event.player.AsyncPlayerChatEvent extends org.bukkit.event.player.PlayerEvent implements org.bukkit.event.Cancellable`
- `public org.bukkit.event.player.AsyncPlayerChatEvent(boolean, org.bukkit.entity.Player, java.lang.String, java.util.Set<org.bukkit.entity.Player>)`
- `public java.lang.String getMessage()`
- `public void setMessage(java.lang.String)`
- `public java.lang.String getFormat()`
- `public void setFormat(java.lang.String) throws java.util.IllegalFormatException, java.lang.NullPointerException`
- `public java.util.Set<org.bukkit.entity.Player> getRecipients()`
- `public boolean isCancelled()`
- `public void setCancelled(boolean)`
- `public org.bukkit.event.HandlerList getHandlers()`
- `public static org.bukkit.event.HandlerList getHandlerList()`
