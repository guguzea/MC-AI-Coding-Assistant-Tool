---
title: "org.bukkit.profile.PlayerTextures"
package: "org.bukkit.profile"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/profile/PlayerTextures.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:59:21.517Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface PlayerTextures**
`public interface PlayerTextures`
- `boolean isEmpty()`
- `void clear()`
- `@Nullable URL getSkin()`
- `void setSkin(@Nullable URL skinUrl)`
- `void setSkin(@Nullable URL skinUrl, @Nullable PlayerTextures.SkinModel skinModel)`
- `@NotNull PlayerTextures.SkinModel getSkinModel()`
- `@Nullable URL getCape()`
- `void setCape(@Nullable URL capeUrl)`
- `long getTimestamp()`
- `boolean isSigned()`
