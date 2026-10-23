---
title: "org.bukkit.block.Sign"
package: "org.bukkit.block"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.21.1-R0.1-SNAPSHOT/spigot-api-1.21.1-R0.1-20241022.152140-54.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:32:12.811Z
asOfVersion: "1.21.1-R0.1-SNAPSHOT"
jarMd5: "9fd276a59330220323c3fdfdcf86d22e"
---

- `public interface org.bukkit.block.Sign extends org.bukkit.block.TileState,org.bukkit.material.Colorable`
- `public abstract java.lang.String[] getLines()`
- `public abstract java.lang.String getLine(int) throws java.lang.IndexOutOfBoundsException`
- `public abstract void setLine(int, java.lang.String) throws java.lang.IndexOutOfBoundsException`
- `public abstract boolean isEditable()`
- `public abstract void setEditable(boolean)`
- `public abstract boolean isWaxed()`
- `public abstract void setWaxed(boolean)`
- `public abstract boolean isGlowingText()`
- `public abstract void setGlowingText(boolean)`
- `public abstract org.bukkit.DyeColor getColor()`
- `public abstract void setColor(org.bukkit.DyeColor)`
- `public abstract org.bukkit.block.sign.SignSide getSide(org.bukkit.block.sign.Side)`
- `public abstract org.bukkit.block.sign.SignSide getTargetSide(org.bukkit.entity.Player)`
- `public abstract org.bukkit.entity.Player getAllowedEditor()`
