# SPacketEncryptionRequest

## Class signature

```java
public class SPacketEncryptionRequest extends java.lang.Object implements Packet < INetHandlerLoginClient >
```

## Constructors

- `public SPacketEncryptionRequest()`
- `public SPacketEncryptionRequest(java.lang.String serverIdIn, java.security.PublicKey publicKeyIn, byte[] verifyTokenIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginClient handler)`
- `public java.lang.String getServerId()`
- `public java.security.PublicKey getPublicKey()`
- `public byte[] getVerifyToken()`