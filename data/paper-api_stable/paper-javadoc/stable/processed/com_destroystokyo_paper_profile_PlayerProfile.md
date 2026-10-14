---
title: "com.destroystokyo.paper.profile.PlayerProfile"
package: "com.destroystokyo.paper.profile"
source: https://jd.papermc.io/paper/26.3/com/destroystokyo/paper/profile/PlayerProfile.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PlayerProfile**
`@NullMarked public interface PlayerProfile extends PlayerProfile, PlayerHeadObjectContents.SkinSource, ObjectContentsLike`
- `@Nullable String getName()`
- `@Deprecated(forRemoval=true, since="1.18.1") String setName(@Nullable String name)`
- `@Nullable UUID getId()`
- `@Deprecated(forRemoval=true, since="1.18.1") @Nullable UUID setId(@Nullable UUID uuid)`
- `PlayerTextures getTextures()`
- `void setTextures(@Nullable PlayerTextures textures)`
- `Set<ProfileProperty> getProperties()`
- `boolean hasProperty(@Nullable String property)`
- `void setProperty(ProfileProperty property)`
- `void setProperties(Collection<ProfileProperty> properties)`
- `boolean removeProperty(@Nullable String property)`
- `default boolean removeProperty(ProfileProperty property)`
- `default boolean removeProperties(Collection<ProfileProperty> properties)`
- `void clearProperties()`
- `boolean isComplete()`
- `boolean completeFromCache()`
- `boolean completeFromCache(boolean onlineMode)`
- `boolean completeFromCache(boolean lookupUUID, boolean onlineMode)`
- `default boolean complete()`
- `boolean complete(boolean textures)`
- `boolean complete(boolean textures, boolean onlineMode)`
- `CompletableFuture<PlayerProfile> update()`
- `default boolean hasTextures()`
- `PlayerProfile clone()`
- `default ObjectContents asObjectContents()`
- `default void applySkinToPlayerHeadContents(PlayerHeadObjectContents.Builder builder)`
