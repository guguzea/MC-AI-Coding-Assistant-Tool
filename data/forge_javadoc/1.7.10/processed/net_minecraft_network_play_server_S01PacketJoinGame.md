# S01PacketJoinGame

**Inheritance:** java.lang.Object → net.minecraft.network.Packet → net.minecraft.network.play.server.S01PacketJoinGame

## Class signature

```java
public class S01PacketJoinGame extends Packet
```

## Constructors

- `S01PacketJoinGame()`
- `S01PacketJoinGame(int p_i45201_1_, WorldSettings.GameType p_i45201_2_, boolean p_i45201_3_, int p_i45201_4_, EnumDifficulty p_i45201_5_, int p_i45201_6_, WorldType p_i45201_7_)`

## Methods

- `EnumDifficulty func_149192_g()`
- `int func_149193_h()`
- `int func_149194_f()`
- `boolean func_149195_d()`
- `WorldType func_149196_i()`
- `int func_149197_c()`
- `WorldSettings.GameType func_149198_e()`
- `void processPacket(INetHandler p_148833_1_)`
- `void processPacket(INetHandlerPlayClient p_148833_1_)`
- `void readPacketData(PacketBuffer p_148837_1_)`
- `java.lang.String serialize()`
- `void writePacketData(PacketBuffer p_148840_1_)`