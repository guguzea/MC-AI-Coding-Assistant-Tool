# NetHandlerStatusServer

## Class signature

```java
public class NetHandlerStatusServer extends java.lang.Object implements INetHandlerStatusServer
```

## Constructors

- `public NetHandlerStatusServer( MinecraftServer serverIn, NetworkManager netManager)`

## Methods

- `public void onDisconnect( IChatComponent reason)`
- `public void processServerQuery( C00PacketServerQuery packetIn)`
- `public void processPing( C01PacketPing packetIn)`

## Description

Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination