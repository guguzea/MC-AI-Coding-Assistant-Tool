---
title: "io.papermc.paper.datacomponent.item.ResolvableProfile"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/ResolvableProfile.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ResolvableProfile**
`@NonExtendable public interface ResolvableProfile extends PlayerHeadObjectContents.SkinSource`
- `@Contract(value="_ -> new", pure=true) static ResolvableProfile resolvableProfile(PlayerProfile profile)`
- `@Contract(value="-> new", pure=true) static ResolvableProfile.Builder resolvableProfile()`
- `@Contract(pure=true) @Nullable UUID uuid()`
- `@Contract(pure=true) @Nullable String name()`
- `@Contract(pure=true) @Unmodifiable Collection<ProfileProperty> properties()`
- `@Contract(pure=true) boolean dynamic()`
- `@Contract(pure=true) CompletableFuture<PlayerProfile> resolve()`
- `@Contract(pure=true) ResolvableProfile.SkinPatch skinPatch()`
