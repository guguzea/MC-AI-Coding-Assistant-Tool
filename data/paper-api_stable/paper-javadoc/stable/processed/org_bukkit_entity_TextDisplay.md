---
title: "org.bukkit.entity.TextDisplay"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/TextDisplay.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Interface TextDisplay**
`public interface TextDisplay extends Display`
- `@Nullable @Deprecated @Nullable String getText()`
- `@Deprecated void setText(@Nullable @Nullable String text)`
- `@NotNull Component text()`
- `void text(@Nullable Component text)`
- `int getLineWidth()`
- `void setLineWidth(int width)`
- `@Nullable @Nullable Color getBackgroundColor()`
- `void setBackgroundColor(@Nullable @Nullable Color color)`
- `byte getTextOpacity()`
- `void setTextOpacity(byte opacity)`
- `boolean isShadowed()`
- `void setShadowed(boolean shadow)`
- `boolean isSeeThrough()`
- `void setSeeThrough(boolean seeThrough)`
- `boolean isDefaultBackground()`
- `void setDefaultBackground(boolean defaultBackground)`
- `@NotNull @NotNull TextDisplay.TextAlignment getAlignment()`
- `void setAlignment(@NotNull @NotNull TextDisplay.TextAlignment alignment)`
