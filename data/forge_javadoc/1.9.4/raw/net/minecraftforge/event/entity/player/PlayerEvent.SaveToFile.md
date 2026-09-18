---
title: "PlayerEvent.SaveToFile"
description: "The player is being saved to the world store. Note that the player may be in the process of logging out or otherwise departing from the world. Don't assume it's association with the world. This allows"
package: "net/minecraftforge/event/entity/player"
version: "1.9.4"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.9.4-12.17.0.2051/net/minecraftforge/event/entity/player/PlayerEvent.SaveToFile.html"
sourceType: javadoc
---

# PlayerEvent.SaveToFile

## Constructors

- `public SaveToFile( EntityPlayer player, java.io.File originDirectory, java.lang.String playerUUID)`

## Methods

- `public java.io.File getPlayerFile(java.lang.String suffix)`
- `public java.io.File getPlayerDirectory()`
- `public java.lang.String getPlayerUUID()`

## Description

The player is being saved to the world store. Note that the player may be in the process of logging out or otherwise departing from the world. Don't assume it's association with the world. This allows
