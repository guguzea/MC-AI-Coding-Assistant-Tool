---
title: "io.papermc.paper.datacomponent.item.ResolvableProfile.Builder"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/1.21.4/io/papermc/paper/datacomponent/item/ResolvableProfile.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-23T07:50:36.606Z
asOfVersion: "1.21.4-R0.1-SNAPSHOT"
---

- `@Contract(value="_ -> this", mutates="this") ResolvableProfile.Builder name(@Pattern("^[!-~]{0,16}$") @Nullable String name)`
- `@Contract(value="_ -> this", mutates="this") ResolvableProfile.Builder uuid(@Nullable UUID uuid)`
- `@Contract(value="_ -> this", mutates="this") ResolvableProfile.Builder addProperty(ProfileProperty property)`
- `@Contract(value="_ -> this", mutates="this") ResolvableProfile.Builder addProperties(Collection<ProfileProperty> properties)`
