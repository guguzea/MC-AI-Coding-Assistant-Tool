---
title: "PlayerEvent.LoadFromFile"
description: "The player is being loaded from the world save. Note that the player won't have been added to the world yet. Intended to allow mods to load an additional file from the players directory containing add"
package: "net/minecraftforge/event/entity/player"
version: "1.12.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraftforge/event/entity/player/PlayerEvent.LoadFromFile.html"
sourceType: javadoc
---

# PlayerEvent.LoadFromFile

## Constructors

- `public LoadFromFile( EntityPlayer player, java.io.File originDirectory, java.lang.String playerUUID)`

## Methods

- `public java.io.File getPlayerFile(java.lang.String suffix)`
- `public java.io.File getPlayerDirectory()`
- `public java.lang.String getPlayerUUID()`

## Description

The player is being loaded from the world save. Note that the player won't have been added to the world yet. Intended to allow mods to load an additional file from the players directory containing add
