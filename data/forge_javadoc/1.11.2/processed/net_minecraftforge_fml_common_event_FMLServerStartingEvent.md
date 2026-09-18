# FMLServerStartingEvent

## Class signature

```java
public class FMLServerStartingEvent extends FMLStateEvent
```

## Constructors

- `public FMLServerStartingEvent(java.lang.Object... data)`

## Methods

- `public LoaderState.ModState getModState()`
- `public MinecraftServer getServer()`
- `public void registerServerCommand( ICommand command)`

## Description

Called after FMLServerAboutToStartEvent and before FMLServerStartedEvent . This event allows for customizations of the server, such as loading custom commands, perhaps customizing recipes or other act