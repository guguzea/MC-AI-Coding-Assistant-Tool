# S08PacketPlayerPosLook

**Inheritance:** java.lang.Object → net.minecraft.network.play.server.S08PacketPlayerPosLook

## Class signature

```java
public class S08PacketPlayerPosLook extends java.lang.Object implements Packet<INetHandlerPlayClient>
```

## Constructors

- `S08PacketPlayerPosLook()`
- `S08PacketPlayerPosLook(double xIn, double yIn, double zIn, float yawIn, float pitchIn, java.util.Set<S08PacketPlayerPosLook.EnumFlags> p_i45993_9_)`

## Methods

- `java.util.Set<S08PacketPlayerPosLook.EnumFlags> func_179834_f()`
- `float getPitch()`
- `double getX()`
- `double getY()`
- `float getYaw()`
- `double getZ()`
- `void processPacket(INetHandlerPlayClient handler)` — Passes this Packet on to the NetHandler for processing.
- `void readPacketData(PacketBuffer buf)` — Reads the raw packet data from the data stream.
- `void writePacketData(PacketBuffer buf)` — Writes the raw packet data to the data stream.