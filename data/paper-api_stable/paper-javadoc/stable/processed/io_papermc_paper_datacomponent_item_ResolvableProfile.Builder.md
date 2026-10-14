---
title: "io.papermc.paper.datacomponent.item.ResolvableProfile.Builder"
package: "io.papermc.paper.datacomponent.item"
source: https://jd.papermc.io/paper/26.3/io/papermc/paper/datacomponent/item/ResolvableProfile.Builder.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface ResolvableProfile.Builder**
`@NonExtendable public static interface ResolvableProfile.Builder extends DataComponentBuilder<ResolvableProfile>`
- `@Contract(value="_ -> this", mutates="this") ResolvableProfile.Builder name(@Pattern("^[!-~]{0,16}$") @Nullable String name)`
- `@Contract(value="_ -> this", mutates="this") ResolvableProfile.Builder uuid(@Nullable UUID uuid)`
- `@Contract(value="_ -> this", mutates="this") ResolvableProfile.Builder addProperty(ProfileProperty property)`
- `@Contract(value="_ -> this", mutates="this") ResolvableProfile.Builder addProperties(Collection<ProfileProperty> properties)`
- `@Contract(value="_ -> this", mutates="this") ResolvableProfile.Builder skinPatch(ResolvableProfile.SkinPatch patch)`
- `@Contract(value="_ -> this", mutates="this") ResolvableProfile.Builder skinPatch(Consumer<ResolvableProfile.SkinPatchBuilder> configure)`
