# PlayerEvent.Visibility

## Constructors

- `public Visibility( EntityPlayer player)`

## Methods

- `public void modifyVisibility(double mod)`
- `public double getVisibilityModifier()`

## Description

Fired when the world checks if a player is near enough to be attacked by an entity. The resulting visibility modifier is multiplied by the one calculated by Minecraft (based on sneaking and more) and