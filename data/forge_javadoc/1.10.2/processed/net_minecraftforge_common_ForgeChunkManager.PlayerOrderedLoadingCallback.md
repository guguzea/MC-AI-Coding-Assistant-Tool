# ForgeChunkManager.PlayerOrderedLoadingCallback

## Class signature

```java
public static interface ForgeChunkManager.PlayerOrderedLoadingCallback extends ForgeChunkManager.LoadingCallback
```

## Methods

- `com.google.common.collect.ListMultimap<java.lang.String, ForgeChunkManager.Ticket> playerTicketsLoaded(com.google.common.collect.ListMultimap<java.lang.String, ForgeChunkManager.Ticket> tickets, World world)` — Called back when tickets are loaded from the world to allow the mod to decide if it wants the ticket still.