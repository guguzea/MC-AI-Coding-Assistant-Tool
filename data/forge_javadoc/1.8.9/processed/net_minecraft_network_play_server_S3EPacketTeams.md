# S3EPacketTeams

## Class signature

```java
public class S3EPacketTeams extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S3EPacketTeams()`
- `public S3EPacketTeams( ScorePlayerTeam p_i45225_1_, int p_i45225_2_)`
- `public S3EPacketTeams( ScorePlayerTeam p_i45226_1_, java.util.Collection<java.lang.String> p_i45226_2_, int p_i45226_3_)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String func_149312_c()`
- `public java.lang.String func_149306_d()`
- `public java.lang.String func_149311_e()`
- `public java.lang.String func_149309_f()`
- `public java.util.Collection<java.lang.String> func_149310_g()`
- `public int func_149307_h()`
- `public int func_149308_i()`
- `public int func_179813_h()`
- `public java.lang.String func_179814_i()`

## Description

Passes this Packet on to the NetHandler for processing.