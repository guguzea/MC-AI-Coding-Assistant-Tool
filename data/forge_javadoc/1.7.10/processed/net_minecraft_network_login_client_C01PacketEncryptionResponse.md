# C01PacketEncryptionResponse

**Inheritance:** java.lang.Object → net.minecraft.network.Packet → net.minecraft.network.login.client.C01PacketEncryptionResponse

## Class signature

```java
public class C01PacketEncryptionResponse extends Packet
```

## Constructors

- `C01PacketEncryptionResponse()`
- `C01PacketEncryptionResponse(javax.crypto.SecretKey p_i45271_1_, java.security.PublicKey p_i45271_2_, byte[] p_i45271_3_)`

## Methods

- `byte[] func_149299_b(java.security.PrivateKey p_149299_1_)`
- `javax.crypto.SecretKey func_149300_a(java.security.PrivateKey p_149300_1_)`
- `void processPacket(INetHandler p_148833_1_)`
- `void processPacket(INetHandlerLoginServer p_148833_1_)`
- `void readPacketData(PacketBuffer p_148837_1_)`
- `void writePacketData(PacketBuffer p_148840_1_)`