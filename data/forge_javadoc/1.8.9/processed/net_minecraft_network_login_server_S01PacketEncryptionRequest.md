# S01PacketEncryptionRequest

## Class signature

```java
public class S01PacketEncryptionRequest extends java.lang.Object implements Packet < INetHandlerLoginClient >
```

## Constructors

- `public S01PacketEncryptionRequest()`
- `public S01PacketEncryptionRequest(java.lang.String serverId, java.security.PublicKey key, byte[] verifyToken)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginClient handler)`
- `public java.lang.String getServerId()`
- `public java.security.PublicKey getPublicKey()`
- `public byte[] getVerifyToken()`

## Description

Passes this Packet on to the NetHandler for processing.