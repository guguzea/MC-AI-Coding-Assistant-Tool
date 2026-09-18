# NetHandlerLoginClient

## Class signature

```java
public class NetHandlerLoginClient extends java.lang.Object implements INetHandlerLoginClient
```

## Constructors

- `public NetHandlerLoginClient( NetworkManager networkManagerIn, Minecraft mcIn, @Nullable GuiScreen previousScreenIn)`

## Methods

- `public void handleEncryptionRequest( SPacketEncryptionRequest packetIn)`
- `public void handleLoginSuccess( SPacketLoginSuccess packetIn)`
- `public void onDisconnect( ITextComponent reason)`
- `public void handleDisconnect( SPacketDisconnect packetIn)`
- `public void handleEnableCompression( SPacketEnableCompression packetIn)`