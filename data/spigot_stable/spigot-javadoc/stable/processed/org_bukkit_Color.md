---
title: "org.bukkit.Color"
package: "org.bukkit"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/Color.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class Color**
`public final class Color extends Object implements ConfigurationSerializable`
- `public static final Color WHITE`
- `public static final Color SILVER`
- `public static final Color GRAY`
- `public static final Color BLACK`
- `public static final Color RED`
- `public static final Color MAROON`
- `public static final Color YELLOW`
- `public static final Color OLIVE`
- `public static final Color LIME`
- `public static final Color GREEN`
- `public static final Color AQUA`
- `public static final Color TEAL`
- `public static final Color BLUE`
- `public static final Color NAVY`
- `public static final Color FUCHSIA`
- `public static final Color PURPLE`
- `public static final Color ORANGE`
- `@NotNull public static Color fromARGB(int alpha, int red, int green, int blue) throws IllegalArgumentException`
- `@NotNull public static Color fromRGB(int red, int green, int blue) throws IllegalArgumentException`
- `@NotNull public static Color fromBGR(int blue, int green, int red) throws IllegalArgumentException`
- `@NotNull public static Color fromRGB(int rgb) throws IllegalArgumentException`
- `@NotNull public static Color fromARGB(int argb)`
- `@NotNull public static Color fromBGR(int bgr) throws IllegalArgumentException`
- `public int getAlpha()`
- `@NotNull public Color setAlpha(int alpha)`
- `public int getRed()`
- `@NotNull public Color setRed(int red)`
- `public int getGreen()`
- `@NotNull public Color setGreen(int green)`
- `public int getBlue()`
- `@NotNull public Color setBlue(int blue)`
- `public int asRGB()`
- `public int asARGB()`
- `public int asBGR()`
- `@NotNull public Color mixDyes(@NotNull DyeColor... colors)`
- `@NotNull public Color mixColors(@NotNull Color... colors)`
- `public boolean equals(Object o)`
- `public int hashCode()`
- `@NotNull public Map<String,Object> serialize()`
- `@NotNull public static Color deserialize(@NotNull Map<String,Object> map)`
- `public String toString()`
