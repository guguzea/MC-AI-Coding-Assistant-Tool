# NetHandlerLoginClient

**Inheritance:** java.lang.Object → net.minecraft.client.network.NetHandlerLoginClient

## Class signature

```java
public class NetHandlerLoginClient extends java.lang.Object implements INetHandlerLoginClient
```

## Constructors

- `NetHandlerLoginClient(NetworkManager networkManagerIn, Minecraft mcIn, GuiScreen previousScreenIn)`

## Methods

- `void handleDisconnect(SPacketDisconnect packetIn)`
- `void handleEnableCompression(SPacketEnableCompression packetIn)`
- `void handleEncryptionRequest(SPacketEncryptionRequest packetIn)`
- `void handleLoginSuccess(SPacketLoginSuccess packetIn)`
- `void onDisconnect(ITextComponent reason)`