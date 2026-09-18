---
title: "C01PacketEncryptionResponse"
description: "public class C01PacketEncryptionResponse extends Packet"
package: "net/minecraft/network/login/client"
version: "1.7.10"
source: "https://skmedix.github.io/ForgeJavaDocs/javadoc/forge/1.7.10-10.13.4.1614/net/minecraft/network/login/client/C01PacketEncryptionResponse.html"
sourceType: javadoc
---

# C01PacketEncryptionResponse

## Class signature

```java
public class C01PacketEncryptionResponse extends Packet
```

## Constructors

- `public C01PacketEncryptionResponse()`
- `public C01PacketEncryptionResponse(javax.crypto.SecretKey p_i45271_1_, java.security.PublicKey p_i45271_2_, byte[] p_i45271_3_)`

## Methods

- `public void readPacketData( PacketBuffer p_148837_1_) throws java.io.IOException`
- `public void writePacketData( PacketBuffer p_148840_1_) throws java.io.IOException`
- `public void processPacket( INetHandlerLoginServer p_148833_1_)`
- `public javax.crypto.SecretKey func_149300_a(java.security.PrivateKey p_149300_1_)`
- `public byte[] func_149299_b(java.security.PrivateKey p_149299_1_)`
- `public void processPacket( INetHandler p_148833_1_)`
