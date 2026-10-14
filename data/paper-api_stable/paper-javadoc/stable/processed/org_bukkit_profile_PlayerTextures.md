---
title: "org.bukkit.profile.PlayerTextures"
package: "org.bukkit.profile"
source: https://jd.papermc.io/paper/26.3/org/bukkit/profile/PlayerTextures.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface PlayerTextures**
`public interface PlayerTextures`
- `boolean isEmpty()`
- `void clear()`
- `@Nullable @Nullable URL getSkin()`
- `void setSkin(@Nullable @Nullable URL skinUrl)`
- `void setSkin(@Nullable @Nullable URL skinUrl, @Nullable @Nullable PlayerTextures.SkinModel skinModel)`
- `@NotNull @NotNull PlayerTextures.SkinModel getSkinModel()`
- `@Nullable @Nullable URL getCape()`
- `void setCape(@Nullable @Nullable URL capeUrl)`
- `long getTimestamp()`
- `boolean isSigned()`
