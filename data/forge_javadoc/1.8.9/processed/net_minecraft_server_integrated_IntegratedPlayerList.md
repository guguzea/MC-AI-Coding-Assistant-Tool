# IntegratedPlayerList

**Inheritance:** java.lang.Object → net.minecraft.server.management.ServerConfigurationManager → net.minecraft.server.integrated.IntegratedPlayerList

## Class signature

```java
public class IntegratedPlayerList extends ServerConfigurationManager
```

## Methods

- `java.lang.String allowUserToConnect(java.net.SocketAddress address, GameProfile profile)` — checks ban-lists, then white-lists, then space for the server.
- `NBTTagCompound getHostPlayerData()` — On integrated servers, returns the host's player data to be written to level.dat.
- `IntegratedServer getServerInstance()`
- `protected void writePlayerData(EntityPlayerMP playerIn)` — also stores the NBTTags if this is an intergratedPlayerList

## Fields

- `IntegratedPlayerList`