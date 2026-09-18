# FMLServerAboutToStartEvent

## Class signature

```java
public class FMLServerAboutToStartEvent extends FMLStateEvent
```

## Constructors

- `public FMLServerAboutToStartEvent(java.lang.Object... data)`

## Methods

- `public LoaderState.ModState getModState()`
- `public MinecraftServer getServer()`

## Description

Called before the server begins loading anything. Called after FMLPostInitializationEvent on the dedicated server, and after the player has hit "Play Selected World" in the client. Called before FMLSe