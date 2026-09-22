# SPacketEncryptionRequest

**Inheritance:** java.lang.Object → net.minecraft.network.login.server.SPacketEncryptionRequest

## Class signature

```java
public class SPacketEncryptionRequest extends java.lang.Object implements Packet<INetHandlerLoginClient>
```

## Constructors

- `SPacketEncryptionRequest()`
- `SPacketEncryptionRequest(java.lang.String serverIdIn, java.security.PublicKey publicKeyIn, byte[] verifyTokenIn)`

## Methods

- `java.security.PublicKey getPublicKey()`
- `java.lang.String getServerId()`
- `byte[] getVerifyToken()`
- `void processPacket(INetHandlerLoginClient handler)`
- `void readPacketData(PacketBuffer buf)`
- `void writePacketData(PacketBuffer buf)`