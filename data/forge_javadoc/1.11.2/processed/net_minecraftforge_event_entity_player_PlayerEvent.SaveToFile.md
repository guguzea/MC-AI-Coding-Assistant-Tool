# PlayerEvent.SaveToFile

## Constructors

- `public SaveToFile( EntityPlayer player, java.io.File originDirectory, java.lang.String playerUUID)`

## Methods

- `public java.io.File getPlayerFile(java.lang.String suffix)`
- `public java.io.File getPlayerDirectory()`
- `public java.lang.String getPlayerUUID()`

## Description

The player is being saved to the world store. Note that the player may be in the process of logging out or otherwise departing from the world. Don't assume it's association with the world. This allows