# ServerData

**Inheritance:** java.lang.Object → net.minecraft.client.multiplayer.ServerData

## Class signature

```java
public class ServerData extends java.lang.Object
```

## Constructors

- `ServerData(java.lang.String name, java.lang.String ip, boolean isLan)`

## Methods

- `void copyFrom(ServerData serverDataIn)`
- `java.lang.String getBase64EncodedIconData()`
- `NBTTagCompound getNBTCompound()`
- `ServerData.ServerResourceMode getResourceMode()`
- `static ServerData getServerDataFromNBTCompound(NBTTagCompound nbtCompound)`
- `boolean isOnLAN()`
- `void setBase64EncodedIconData(java.lang.String icon)`
- `void setResourceMode(ServerData.ServerResourceMode mode)`

## Fields

- `java.lang.String gameVersion`
- `boolean pinged`
- `long pingToServer`
- `java.lang.String playerList`
- `java.lang.String populationInfo`
- `java.lang.String serverIP`
- `java.lang.String serverMOTD`
- `java.lang.String serverName`
- `int version`