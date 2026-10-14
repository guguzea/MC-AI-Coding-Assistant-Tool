---
title: "org.bukkit.entity.Display"
package: "org.bukkit.entity"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Display.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Interface Display**
`public interface Display extends Entity`
- `@NotNull Transformation getTransformation()`
- `void setTransformation(@NotNull Transformation transformation)`
- `void setTransformationMatrix(@NotNull org.joml.Matrix4f transformationMatrix)`
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
- `@NotNull Display.Billboard getBillboard()`
- `void setBillboard(@NotNull Display.Billboard billboard)`
- `@Nullable Color getGlowColorOverride()`
- `void setGlowColorOverride(@Nullable Color color)`
- `@Nullable Display.Brightness getBrightness()`
- `void setBrightness(@Nullable Display.Brightness brightness)`
