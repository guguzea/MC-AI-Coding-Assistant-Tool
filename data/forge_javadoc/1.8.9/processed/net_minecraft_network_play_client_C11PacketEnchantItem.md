# C11PacketEnchantItem

## Class signature

```java
public class C11PacketEnchantItem extends java.lang.Object implements Packet < INetHandlerPlayServer >
```

## Constructors

- `public C11PacketEnchantItem()`
- `public C11PacketEnchantItem(int windowId, int button)`

## Methods

- `public void processPacket( INetHandlerPlayServer handler)`
- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public int getWindowId()`
- `public int getButton()`

## Description

Passes this Packet on to the NetHandler for processing.