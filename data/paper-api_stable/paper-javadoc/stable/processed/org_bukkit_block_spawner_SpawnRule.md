---
title: "org.bukkit.block.spawner.SpawnRule"
package: "org.bukkit.block.spawner"
source: https://jd.papermc.io/paper/26.3/org/bukkit/block/spawner/SpawnRule.html
sourceType: javadoc
fetchedWith: fetch-spigot-javadoc.mjs@1
fetchedAt: 2026-10-14T13:02:54.065Z
asOfVersion: "26.3.build.178-stable"
---

**Class SpawnRule**
`public class SpawnRule extends Object implements Cloneable, ConfigurationSerializable`
- `public SpawnRule(int minBlockLight, int maxBlockLight, int minSkyLight, int maxSkyLight)`
- `public int getMinBlockLight()`
- `public void setMinBlockLight(int minBlockLight)`
- `public int getMaxBlockLight()`
- `public void setMaxBlockLight(int maxBlockLight)`
- `public int getMinSkyLight()`
- `public void setMinSkyLight(int minSkyLight)`
- `public int getMaxSkyLight()`
- `public void setMaxSkyLight(int maxSkyLight)`
- `public boolean equals(Object obj)`
- `public int hashCode()`
- `@NotNull public @NotNull SpawnRule clone()`
- `@NotNull public @NotNull Map<String,Object> serialize()`
- `@NotNull public static @NotNull SpawnRule deserialize(@NotNull @NotNull Map<String,Object> args)`
