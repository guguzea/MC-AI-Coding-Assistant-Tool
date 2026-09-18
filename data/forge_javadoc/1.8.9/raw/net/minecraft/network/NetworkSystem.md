---
title: "NetworkSystem"
description: "True if this NetworkSystem has never had his endpoints terminated"
package: "net/minecraft/network"
version: "1.8.9"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/NetworkSystem.html"
sourceType: javadoc
---

# NetworkSystem

## Class signature

```java
public class NetworkSystem extends java.lang.Object
```

## Constructors

- `public NetworkSystem( MinecraftServer server)`

## Methods

- `public void addLanEndpoint(java.net.InetAddress address, int port) throws java.io.IOException`
- `public java.net.SocketAddress addLocalEndpoint()`
- `public void terminateEndpoints()`
- `public void networkTick()`
- `public MinecraftServer getServer()`

## Description

True if this NetworkSystem has never had his endpoints terminated
