# ForgeChunkManager.OrderedLoadingCallback

## Class signature

```java
public static interface ForgeChunkManager.OrderedLoadingCallback extends ForgeChunkManager.LoadingCallback
```

## Methods

- `java.util.List<ForgeChunkManager.Ticket> ticketsLoaded(java.util.List<ForgeChunkManager.Ticket> tickets, World world, int maxTicketCount)` — Called back when tickets are loaded from the world to allow the mod to decide if it wants the ticket still, and prioritise overflow based on the ticket count.