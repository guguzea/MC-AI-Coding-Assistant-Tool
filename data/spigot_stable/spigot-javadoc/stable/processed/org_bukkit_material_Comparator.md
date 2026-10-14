---
title: "org.bukkit.material.Comparator"
package: "org.bukkit.material"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/material/Comparator.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class Comparator**
`@Deprecated(since="1.14.1") public class Comparator extends MaterialData implements Directional, Redstone`
- `protected static final BlockFace DEFAULT_DIRECTION`
- `protected static final boolean DEFAULT_SUBTRACTION_MODE`
- `protected static final boolean DEFAULT_STATE`
- `public Comparator()`
- `public Comparator(BlockFace facingDirection)`
- `public Comparator(BlockFace facingDirection, boolean isSubtraction)`
- `public Comparator(BlockFace facingDirection, boolean isSubtraction, boolean state)`
- `public Comparator(Material type)`
- `@Deprecated(since="1.9") public Comparator(Material type, byte data)`
- `public void setSubtractionMode(boolean isSubtraction)`
- `public boolean isSubtractionMode()`
- `public void setFacingDirection(BlockFace face)`
- `public BlockFace getFacing()`
- `public String toString()`
- `public Comparator clone()`
- `public boolean isPowered()`
- `public boolean isBeingPowered()`
