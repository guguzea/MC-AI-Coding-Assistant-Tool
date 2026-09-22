# C01PacketEncryptionResponse

**Inheritance:** java.lang.Object → net.minecraft.network.login.client.C01PacketEncryptionResponse

## Class signature

```java
public class C01PacketEncryptionResponse extends java.lang.Object implements Packet<INetHandlerLoginServer>
```

## Constructors

- `C01PacketEncryptionResponse()`
- `C01PacketEncryptionResponse(javax.crypto.SecretKey secretKey, java.security.PublicKey publicKey, byte[] verifyToken)`

## Methods

- `javax.crypto.SecretKey getSecretKey(java.security.PrivateKey key)`
- `byte[] getVerifyToken(java.security.PrivateKey key)`
- `void processPacket(INetHandlerLoginServer handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.