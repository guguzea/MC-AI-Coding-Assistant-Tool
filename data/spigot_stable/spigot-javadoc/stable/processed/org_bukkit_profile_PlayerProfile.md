---
title: "org.bukkit.profile.PlayerProfile"
package: "org.bukkit.profile"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/profile/PlayerProfile.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface PlayerProfile**
`public interface PlayerProfile extends Cloneable, ConfigurationSerializable`
- `@Nullable UUID getUniqueId()`
- `@Nullable String getName()`
- `@NotNull PlayerTextures getTextures()`
- `void setTextures(@Nullable PlayerTextures textures)`
- `@NotNull @Experimental PlayerSkinPatch getSkinPatch()`
- `@Experimental void setSkinPatch(@Nullable PlayerSkinPatch patch)`
- `boolean isComplete()`
- `@NotNull CompletableFuture<PlayerProfile> update()`
- `@NotNull PlayerProfile clone()`
