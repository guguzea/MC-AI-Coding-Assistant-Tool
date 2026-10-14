---
title: "org.bukkit.material.Diode"
package: "org.bukkit.material"
source: https://hub.spigotmc.org/javadocs/spigot/org/bukkit/material/Diode.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T12:58:46.913Z
asOfVersion: "26.3-R0.1-SNAPSHOT"
---

**Class Diode**
`@Deprecated(since="1.14.1") public class Diode extends MaterialData implements Directional, Redstone`
- `protected static final BlockFace DEFAULT_DIRECTION`
- `protected static final int DEFAULT_DELAY`
- `protected static final boolean DEFAULT_STATE`
- `public Diode()`
- `public Diode(BlockFace facingDirection)`
- `public Diode(BlockFace facingDirection, int delay)`
- `public Diode(BlockFace facingDirection, int delay, boolean state)`
- `public Diode(Material type)`
- `@Deprecated(since="1.6.2") public Diode(Material type, byte data)`
- `public void setDelay(int delay)`
- `public int getDelay()`
- `public void setFacingDirection(BlockFace face)`
- `public BlockFace getFacing()`
- `public String toString()`
- `public Diode clone()`
- `public boolean isPowered()`
