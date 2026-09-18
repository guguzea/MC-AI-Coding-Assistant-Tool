# NetHandlerStatusServer

## Class signature

```java
public class NetHandlerStatusServer extends java.lang.Object implements INetHandlerStatusServer
```

## Constructors

- `public NetHandlerStatusServer( MinecraftServer serverIn, NetworkManager netManager)`

## Methods

- `public void onDisconnect( ITextComponent reason)`
- `public void processServerQuery( CPacketServerQuery packetIn)`
- `public void processPing( CPacketPing packetIn)`