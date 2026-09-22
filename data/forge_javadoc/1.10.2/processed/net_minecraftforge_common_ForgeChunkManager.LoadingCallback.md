# ForgeChunkManager.LoadingCallback

## Class signature

```java
public static interface ForgeChunkManager.LoadingCallback
```

## Methods

- `void ticketsLoaded(java.util.List<ForgeChunkManager.Ticket> tickets, World world)` — Called back when tickets are loaded from the world to allow the mod to re-register the chunks associated with those tickets.