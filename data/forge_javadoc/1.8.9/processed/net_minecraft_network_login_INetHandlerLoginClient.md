# INetHandlerLoginClient

## Class signature

```java
public interface INetHandlerLoginClient extends INetHandler
```

## Methods

- `void handleDisconnect(S00PacketDisconnect packetIn)`
- `void handleEnableCompression(S03PacketEnableCompression packetIn)`
- `void handleEncryptionRequest(S01PacketEncryptionRequest packetIn)`
- `void handleLoginSuccess(S02PacketLoginSuccess packetIn)`