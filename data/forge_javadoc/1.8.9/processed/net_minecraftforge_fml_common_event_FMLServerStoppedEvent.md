# FMLServerStoppedEvent

## Class signature

```java
public class FMLServerStoppedEvent extends FMLStateEvent
```

## Constructors

- `public FMLServerStoppedEvent(java.lang.Object... data)`

## Methods

- `public LoaderState.ModState getModState()`

## Description

Called after FMLServerStoppingEvent when the server has completely shut down. Called immediately before shutting down, on the dedicated server, and before returning to the main menu on the client.