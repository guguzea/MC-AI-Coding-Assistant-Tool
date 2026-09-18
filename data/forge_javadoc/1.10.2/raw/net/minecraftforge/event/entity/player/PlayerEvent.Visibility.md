---
title: "PlayerEvent.Visibility"
description: "Fired when the world checks if a player is near enough to be attacked by an entity. The resulting visibility modifier is multiplied by the one calculated by Minecraft (based on sneaking and more) and "
package: "net/minecraftforge/event/entity/player"
version: "1.10.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.10.2-12.18.3.2185/net/minecraftforge/event/entity/player/PlayerEvent.Visibility.html"
sourceType: javadoc
---

# PlayerEvent.Visibility

## Constructors

- `public Visibility( EntityPlayer player)`

## Methods

- `public void modifyVisibility(double mod)`
- `public double getVisibilityModifier()`

## Description

Fired when the world checks if a player is near enough to be attacked by an entity. The resulting visibility modifier is multiplied by the one calculated by Minecraft (based on sneaking and more) and 
