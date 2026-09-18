# NetHandlerLoginClient

## Class signature

```java
public class NetHandlerLoginClient extends java.lang.Object implements INetHandlerLoginClient
```

## Constructors

- `public NetHandlerLoginClient( NetworkManager p_i45059_1_, Minecraft mcIn, GuiScreen p_i45059_3_)`

## Methods

- `public void handleEncryptionRequest( S01PacketEncryptionRequest packetIn)`
- `public void handleLoginSuccess( S02PacketLoginSuccess packetIn)`
- `public void onDisconnect( IChatComponent reason)`
- `public void handleDisconnect( S00PacketDisconnect packetIn)`
- `public void handleEnableCompression( S03PacketEnableCompression packetIn)`

## Description

Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination