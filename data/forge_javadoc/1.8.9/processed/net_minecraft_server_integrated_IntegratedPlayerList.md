# IntegratedPlayerList

## Class signature

```java
public class IntegratedPlayerList extends ServerConfigurationManager
```

## Constructors

- `public IntegratedPlayerList( IntegratedServer p_i1314_1_)`

## Methods

- `protected void writePlayerData( EntityPlayerMP playerIn)`
- `public java.lang.String allowUserToConnect(java.net.SocketAddress address, GameProfile profile)`
- `public IntegratedServer getServerInstance()`
- `public NBTTagCompound getHostPlayerData()`

## Description

checks ban-lists, then white-lists, then space for the server.