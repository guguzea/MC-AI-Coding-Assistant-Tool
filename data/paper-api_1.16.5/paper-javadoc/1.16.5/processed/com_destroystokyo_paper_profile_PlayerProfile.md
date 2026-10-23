---
title: "com.destroystokyo.paper.profile.PlayerProfile"
package: "com.destroystokyo.paper.profile"
source: https://jd.papermc.io/paper/1.16.5/com/destroystokyo/paper/profile/PlayerProfile.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T08:04:41.693Z
asOfVersion: "1.16.5-R0.1-SNAPSHOT"
---

- `@Nullable @Nullable String getName()`
- `@NotNull @NotNull String setName&#8203;(@Nullable @Nullable String name)`
- `@Nullable @Nullable UUID getId()`
- `@Nullable @Nullable UUID setId&#8203;(@Nullable @Nullable UUID uuid)`
- `@NotNull @NotNull Set<ProfileProperty> getProperties()`
- `boolean hasProperty&#8203;(@Nullable @Nullable String property)`
- `void setProperty&#8203;(@NotNull @NotNull ProfileProperty property)`
- `void setProperties&#8203;(@NotNull @NotNull Collection<ProfileProperty> properties)`
- `boolean removeProperty&#8203;(@Nullable @Nullable String property)`
- `default boolean removeProperty&#8203;(@NotNull @NotNull ProfileProperty property)`
- `default boolean removeProperties&#8203;(@NotNull @NotNull Collection<ProfileProperty> properties)`
- `void clearProperties()`
- `boolean isComplete()`
- `boolean completeFromCache()`
- `boolean completeFromCache&#8203;(boolean onlineMode)`
- `boolean completeFromCache&#8203;(boolean lookupUUID, boolean onlineMode)`
- `default boolean complete()`
- `boolean complete&#8203;(boolean textures)`
- `boolean complete&#8203;(boolean textures, boolean onlineMode)`
- `default boolean hasTextures()`
