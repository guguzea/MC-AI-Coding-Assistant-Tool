# Packet

**Inheritance:** java.lang.Object → net.minecraft.network.Packet

## Class signature

```java
public abstract class Packet extends java.lang.Object
```

## Constructors

- `Packet()`

## Methods

- `static Packet generatePacket(BiMap p_148839_0_, int p_148839_1_)`
- `boolean hasPriority()`
- `abstract void processPacket(INetHandler p_148833_1_)`
- `static byte[] readBlob(ByteBuf p_148834_0_)`
- `abstract void readPacketData(PacketBuffer p_148837_1_)`
- `java.lang.String serialize()`
- `java.lang.String toString()`
- `static void writeBlob(ByteBuf p_148838_0_, byte[] p_148838_1_)`
- `abstract void writePacketData(PacketBuffer p_148840_1_)`