# NetHandlerLoginClient

**Inheritance:** java.lang.Object → net.minecraft.client.network.NetHandlerLoginClient

## Class signature

```java
public class NetHandlerLoginClient extends java.lang.Object implements INetHandlerLoginClient
```

## Constructors

- `NetHandlerLoginClient(NetworkManager p_i45059_1_, Minecraft mcIn, GuiScreen p_i45059_3_)`

## Methods

- `void handleDisconnect(S00PacketDisconnect packetIn)`
- `void handleEnableCompression(S03PacketEnableCompression packetIn)`
- `void handleEncryptionRequest(S01PacketEncryptionRequest packetIn)`
- `void handleLoginSuccess(S02PacketLoginSuccess packetIn)`
- `void onDisconnect(IChatComponent reason)` — Invoked when disconnecting, the parameter is a ChatComponent describing the reason for termination