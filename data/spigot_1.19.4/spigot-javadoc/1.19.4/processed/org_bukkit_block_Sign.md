---
title: "org.bukkit.block.Sign"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.19.4-R0.1-SNAPSHOT/spigot-api-1.19.4-R0.1-20230607.155743-88.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:56:49.588Z
asOfVersion: "1.19.4-R0.1-SNAPSHOT"
jarMd5: "5f333efcd2669f68a5c4bd2beb6341e9"
---

- `public interface org.bukkit.block.Sign extends org.bukkit.block.TileState,org.bukkit.material.Colorable`
- `public abstract java.lang.String[] getLines()`
- `public abstract java.lang.String getLine(int) throws java.lang.IndexOutOfBoundsException`
- `public abstract void setLine(int, java.lang.String) throws java.lang.IndexOutOfBoundsException`
- `public abstract boolean isEditable()`
- `public abstract void setEditable(boolean)`
- `public abstract boolean isGlowingText()`
- `public abstract void setGlowingText(boolean)`
- `public abstract org.bukkit.DyeColor getColor()`
- `public abstract void setColor(org.bukkit.DyeColor)`
- `public abstract org.bukkit.block.sign.SignSide getSide(org.bukkit.block.sign.Side)`
