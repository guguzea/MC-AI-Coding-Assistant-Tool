---
title: "PlayerEvent.SaveToFile"
description: "The player is being saved to the world store. Note that the player may be in the process of logging out or otherwise departing from the world. Don't assume it's association with the world. This allows"
package: "net/minecraftforge/event/entity/player"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraftforge/event/entity/player/PlayerEvent.SaveToFile.html"
sourceType: javadoc
---

# PlayerEvent.SaveToFile

## Constructors

- `public SaveToFile( EntityPlayer player, java.io.File originDirectory, java.lang.String playerUUID)`

## Methods

- `public java.io.File getPlayerFile(java.lang.String suffix)`

## Description

The player is being saved to the world store. Note that the player may be in the process of logging out or otherwise departing from the world. Don't assume it's association with the world. This allows
