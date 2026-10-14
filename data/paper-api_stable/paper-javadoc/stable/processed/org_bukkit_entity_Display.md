---
title: "org.bukkit.entity.Display"
package: "org.bukkit.entity"
source: https://jd.papermc.io/paper/26.3/org/bukkit/entity/Display.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:00:27.472Z
asOfVersion: "26.3.build.178-stable"
---

**Interface Display**
`public interface Display extends Entity`
- `@NotNull @NotNull Transformation getTransformation()`
- `void setTransformation(@NotNull @NotNull Transformation transformation)`
- `void setTransformationMatrix(@NotNull @NotNull Matrix4f transformationMatrix)`
- `int getInterpolationDuration()`
- `void setInterpolationDuration(int duration)`
- `int getTeleportDuration()`
- `void setTeleportDuration(int duration)`
- `float getViewRange()`
- `void setViewRange(float range)`
- `float getShadowRadius()`
- `void setShadowRadius(float radius)`
- `float getShadowStrength()`
- `void setShadowStrength(float strength)`
- `float getDisplayWidth()`
- `void setDisplayWidth(float width)`
- `float getDisplayHeight()`
- `void setDisplayHeight(float height)`
- `int getInterpolationDelay()`
- `void setInterpolationDelay(int ticks)`
- `@NotNull @NotNull Display.Billboard getBillboard()`
- `void setBillboard(@NotNull @NotNull Display.Billboard billboard)`
- `@Nullable @Nullable Color getGlowColorOverride()`
- `void setGlowColorOverride(@Nullable @Nullable Color color)`
- `@Nullable @Nullable Display.Brightness getBrightness()`
- `void setBrightness(@Nullable @Nullable Display.Brightness brightness)`
