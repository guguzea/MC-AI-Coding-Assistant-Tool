---
title: "org.bukkit.profile.PlayerProfile"
package: "org.bukkit.profile"
source: https://jd.papermc.io/paper/26.3/org/bukkit/profile/PlayerProfile.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PlayerProfile**
`@Deprecated(since="1.18.1") public interface PlayerProfile extends Cloneable, ConfigurationSerializable`
- `@Nullable @Deprecated(since="1.18.1") @Nullable UUID getUniqueId()`
- `@Nullable @Nullable String getName()`
- `@NotNull @NotNull PlayerTextures getTextures()`
- `void setTextures(@Nullable @Nullable PlayerTextures textures)`
- `boolean isComplete()`
- `@NotNull @NotNull CompletableFuture<? extends PlayerProfile> update()`
- `@NotNull @NotNull PlayerProfile clone()`
