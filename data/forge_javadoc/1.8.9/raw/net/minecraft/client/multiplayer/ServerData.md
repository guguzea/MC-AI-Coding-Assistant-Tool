---
title: "ServerData"
description: "public class ServerData extends java.lang.Object"
package: "net/minecraft/client/multiplayer"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/client/multiplayer/ServerData.html"
sourceType: javadoc
---

# ServerData

**Inheritance:** java.lang.Object → net.minecraft.client.multiplayer.ServerData

## Class signature

```java
public class ServerData extends java.lang.Object
```

## Constructors

- `ServerData(java.lang.String p_i46420_1_, java.lang.String p_i46420_2_, boolean p_i46420_3_)`

## Methods

- `void copyFrom(ServerData serverDataIn)`
- `boolean func_181041_d()`
- `java.lang.String getBase64EncodedIconData()` — Returns the base-64 encoded representation of the server's icon, or null if not available
- `NBTTagCompound getNBTCompound()` — Returns an NBTTagCompound with the server's name, IP and maybe acceptTextures.
- `ServerData.ServerResourceMode getResourceMode()`
- `static ServerData getServerDataFromNBTCompound(NBTTagCompound nbtCompound)` — Takes an NBTTagCompound with 'name' and 'ip' keys, returns a ServerData instance.
- `void setBase64EncodedIconData(java.lang.String icon)`
- `void setResourceMode(ServerData.ServerResourceMode mode)`

## Fields

- `boolean field_78841_f`
- `java.lang.String gameVersion` — Game version for this server.
- `long pingToServer` — last server ping that showed up in the server browser
- `java.lang.String playerList`
- `java.lang.String populationInfo` — the string indicating number of players on and capacity of the server that is shown on the server browser (i.e
- `java.lang.String serverIP`
- `java.lang.String serverMOTD` — (better variable name would be 'hostname') server name as displayed in the server browser's second line (grey text)
- `java.lang.String serverName`
- `int version`
