---
title: "org.bukkit.boss.BossBar"
package: "org.bukkit.boss"
source: https://repo.papermc.io/repository/maven-public/org/spigotmc/spigot-api/1.12.2-R0.1-SNAPSHOT/spigot-api-1.12.2-R0.1-20180712.012057-156.jar
sourceType: javap
fetchedWith: extract-spigot-api-surface.mjs@1
fetchedAt: 2026-10-23T15:35:10.184Z
asOfVersion: "1.12.2-R0.1-SNAPSHOT"
jarMd5: "f1c84754979a6e1344a24f09bb1fed35"
---

- `public interface org.bukkit.boss.BossBar`
- `public abstract java.lang.String getTitle()`
- `public abstract void setTitle(java.lang.String)`
- `public abstract org.bukkit.boss.BarColor getColor()`
- `public abstract void setColor(org.bukkit.boss.BarColor)`
- `public abstract org.bukkit.boss.BarStyle getStyle()`
- `public abstract void setStyle(org.bukkit.boss.BarStyle)`
- `public abstract void removeFlag(org.bukkit.boss.BarFlag)`
- `public abstract void addFlag(org.bukkit.boss.BarFlag)`
- `public abstract boolean hasFlag(org.bukkit.boss.BarFlag)`
- `public abstract void setProgress(double)`
- `public abstract double getProgress()`
- `public abstract void addPlayer(org.bukkit.entity.Player)`
- `public abstract void removePlayer(org.bukkit.entity.Player)`
- `public abstract void removeAll()`
- `public abstract java.util.List<org.bukkit.entity.Player> getPlayers()`
- `public abstract void setVisible(boolean)`
- `public abstract boolean isVisible()`
- `public abstract void show()`
- `public abstract void hide()`
