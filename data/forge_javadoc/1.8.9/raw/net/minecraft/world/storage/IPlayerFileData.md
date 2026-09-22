---
title: "IPlayerFileData"
description: "public interface IPlayerFileData"
package: "net/minecraft/world/storage"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/world/storage/IPlayerFileData.html"
sourceType: javadoc
---

# IPlayerFileData

## Class signature

```java
public interface IPlayerFileData
```

## Methods

- `java.lang.String[] getAvailablePlayerDat()` — Returns an array of usernames for which player.dat exists for.
- `NBTTagCompound readPlayerData(EntityPlayer player)` — Reads the player data from disk into the specified PlayerEntityMP.
- `void writePlayerData(EntityPlayer player)` — Writes the player data to disk from the specified PlayerEntityMP.
