# NetHandlerHandshakeTCP

## Class signature

```java
public class NetHandlerHandshakeTCP extends java.lang.Object implements INetHandlerHandshakeServer
```

## Constructors

- `public NetHandlerHandshakeTCP( MinecraftServer serverIn, NetworkManager netManager)`

## Methods

- `public void processHandshake( C00Handshake packetIn)`
- `public void onDisconnect( IChatComponent reason)`

## Description

Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination