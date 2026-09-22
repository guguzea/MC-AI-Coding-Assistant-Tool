---
title: "RConThreadBase"
description: "public abstract class RConThreadBase extends java.lang.Object implements java.lang.Runnable"
package: "net/minecraft/network/rcon"
version: "1.12.2"
forgeBuild: "14.23.5.2859"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.12.2-14.23.5.2859/net/minecraft/network/rcon/RConThreadBase.html"
sourceType: javadoc
---

# RConThreadBase

**Inheritance:** java.lang.Object → net.minecraft.network.rcon.RConThreadBase

## Class signature

```java
public abstract class RConThreadBase extends java.lang.Object implements java.lang.Runnable
```

## Constructors

- `RConThreadBase(IServer serverIn, java.lang.String threadName)`

## Methods

- `protected void closeAllSockets_do(boolean logWarning)`
- `protected void closeAllSockets()`
- `protected boolean closeServerSocket_do(java.net.ServerSocket socket, boolean removeFromList)`
- `protected boolean closeServerSocket(java.net.ServerSocket socket)`
- `protected boolean closeSocket(java.net.DatagramSocket socket, boolean removeFromList)`
- `protected int getNumberOfPlayers()`
- `boolean isRunning()`
- `protected void logDebug(java.lang.String msg)`
- `protected void logInfo(java.lang.String msg)`
- `protected void logSevere(java.lang.String msg)`
- `protected void logWarning(java.lang.String msg)`
- `protected void registerSocket(java.net.DatagramSocket socket)`
- `void startThread()`

## Fields

- `protected int maxStopWait`
- `protected java.lang.Thread rconThread`
- `protected boolean running`
- `protected IServer server`
- `protected java.util.List<java.net.ServerSocket> serverSocketList`
- `protected java.util.List<java.net.DatagramSocket> socketList`
- `protected java.lang.String threadName`
