---
title: "ServerList"
description: "public class ServerList extends java.lang.Object"
package: "net/minecraft/client/multiplayer"
version: "1.11.2"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.11.2-13.20.0.2228/net/minecraft/client/multiplayer/ServerList.html"
sourceType: javadoc
---

# ServerList

## Class signature

```java
public class ServerList extends java.lang.Object
```

## Constructors

- `public ServerList( Minecraft mcIn)`

## Methods

- `public void loadServerList()`
- `public void saveServerList()`
- `public ServerData getServerData(int index)`
- `public void removeServerData(int index)`
- `public void addServerData( ServerData server)`
- `public int countServers()`
- `public void swapServers(int pos1, int pos2)`
- `public void set(int index, ServerData server)`
- `public static void saveSingleServer( ServerData server)`
