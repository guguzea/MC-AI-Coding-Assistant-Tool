# SPacketRemoveEntityEffect

## Class signature

```java
public class SPacketRemoveEntityEffect extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketRemoveEntityEffect()`
- `public SPacketRemoveEntityEffect(int entityIdIn, Potion potionIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `@Nullable public Entity getEntity( World worldIn)`
- `@Nullable public Potion getPotion()`