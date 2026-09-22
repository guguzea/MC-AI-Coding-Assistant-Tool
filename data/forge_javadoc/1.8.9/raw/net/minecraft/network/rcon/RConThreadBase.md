---
title: "RConThreadBase"
description: "public abstract class RConThreadBase extends java.lang.Object implements java.lang.Runnable"
package: "net/minecraft/network/rcon"
version: "1.8.9"
forgeBuild: "11.15.1.2318"
fetchedWith: "c4-2026-09-22"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.8.9-11.15.1.2318/net/minecraft/network/rcon/RConThreadBase.html"
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

- `protected void closeAllSockets_do(boolean logWarning)` — Closes all of the opened sockets
- `protected void closeAllSockets()` — Closes all of the opened sockets
- `protected boolean closeServerSocket_do(java.net.ServerSocket socket, boolean removeFromList)` — Closes the specified ServerSocket
- `protected boolean closeServerSocket(java.net.ServerSocket socket)` — Closes the specified ServerSocket
- `protected boolean closeSocket(java.net.DatagramSocket socket, boolean removeFromList)` — Closes the specified DatagramSocket
- `protected int getNumberOfPlayers()` — Returns the number of players on the server
- `boolean isRunning()` — Returns true if the Thread is running, false otherwise
- `protected void logDebug(java.lang.String msg)` — Log debug message
- `protected void logInfo(java.lang.String msg)` — Log information message
- `protected void logSevere(java.lang.String msg)` — Log severe error message
- `protected void logWarning(java.lang.String msg)` — Log warning message
- `protected void registerSocket(java.net.DatagramSocket socket)` — Registers a DatagramSocket with this thread
- `void startThread()` — Creates a new Thread object from this class and starts running

## Fields

- `protected int field_72615_d`
- `protected java.lang.Thread rconThread` — Thread for this runnable class
- `protected boolean running` — True if the Thread is running, false otherwise
- `protected IServer server` — Reference to the IServer object.
- `protected java.util.List<java.net.ServerSocket> serverSocketList`
- `protected java.util.List<java.net.DatagramSocket> socketList`
- `protected java.lang.String threadName`
