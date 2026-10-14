---
title: "org.bukkit.entity.Cat"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Cat.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Cat**
`public interface Cat extends Tameable, Sittable, CollarColorable`
- `@NotNull @NotNull Cat.Type getCatType()`
- `void setCatType(@NotNull @NotNull Cat.Type type)`
- `@NotNull @NotNull Cat.SoundVariant getSoundVariant()`
- `void setSoundVariant(@NotNull @NotNull Cat.SoundVariant variant)`
- `@NotNull @NotNull DyeColor getCollarColor()`
- `void setCollarColor(@NotNull @NotNull DyeColor color)`
- `void setLyingDown(boolean lyingDown)`
- `boolean isLyingDown()`
- `void setHeadUp(boolean headUp)`
- `boolean isHeadUp()`
