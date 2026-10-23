---
title: "com.destroystokyo.paper.profile.PlayerProfile"
package: "com.destroystokyo.paper.profile"
source: https://jd.papermc.io/paper/1.20.1/com/destroystokyo/paper/profile/PlayerProfile.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:58:42.132Z
asOfVersion: "1.20.1-R0.1-SNAPSHOT"
---

- `@Nullable @Nullable String getName()`
- `@NotNull @Deprecated(forRemoval=true) @NotNull String setName(@Nullable @Nullable String name)`
- `@Nullable @Nullable UUID getId()`
- `@Nullable @Deprecated(forRemoval=true) @Nullable UUID setId(@Nullable @Nullable UUID uuid)`
- `@NotNull @NotNull PlayerTextures getTextures()`
- `void setTextures(@Nullable @Nullable PlayerTextures textures)`
- `@NotNull @NotNull Set<ProfileProperty> getProperties()`
- `boolean hasProperty(@Nullable @Nullable String property)`
- `void setProperty(@NotNull @NotNull ProfileProperty property)`
- `void setProperties(@NotNull @NotNull Collection<ProfileProperty> properties)`
- `boolean removeProperty(@Nullable @Nullable String property)`
- `default boolean removeProperty(@NotNull @NotNull ProfileProperty property)`
- `default boolean removeProperties(@NotNull @NotNull Collection<ProfileProperty> properties)`
- `void clearProperties()`
- `boolean isComplete()`
- `boolean completeFromCache()`
- `boolean completeFromCache(boolean onlineMode)`
- `boolean completeFromCache(boolean lookupUUID, boolean onlineMode)`
- `default boolean complete()`
- `boolean complete(boolean textures)`
- `boolean complete(boolean textures, boolean onlineMode)`
- `@NotNull @NotNull CompletableFuture<PlayerProfile> update()`
- `default boolean hasTextures()`
