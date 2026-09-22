# ForgeChunkManager.Ticket

**Inheritance:** java.lang.Object → net.minecraftforge.common.ForgeChunkManager.Ticket

## Class signature

```java
public static class ForgeChunkManager.Ticket extends java.lang.Object
```

## Methods

- `void bindEntity(Entity entity)` — Bind the entity to the ticket for ForgeChunkManager.Type.ENTITY type tickets.
- `<any> getChunkList()` — Gets a list of requested chunks for this ticket.
- `int getChunkListDepth()` — Gets the current max depth for this ticket.
- `Entity getEntity()` — Get the entity associated with this ForgeChunkManager.Type.ENTITY type ticket
- `int getMaxChunkListDepth()` — Get the maximum chunk depth size
- `NBTTagCompound getModData()` — Retrieve the NBTTagCompound that stores mod specific data for the chunk ticket.
- `java.lang.String getModId()` — Get the associated mod id
- `java.lang.String getPlayerName()` — Get the player associated with this ticket
- `ForgeChunkManager.Type getType()` — Gets the ticket type
- `boolean isPlayerTicket()` — Is this a player associated ticket rather than a mod associated ticket?
- `void setChunkListDepth(int depth)` — The chunk list depth can be manipulated up to the maximal grant allowed for the mod.

## Fields

- `World world`