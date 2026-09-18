# SPacketSetExperience

## Class signature

```java
public class SPacketSetExperience extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public SPacketSetExperience()`
- `public SPacketSetExperience(float experienceBarIn, int totalExperienceIn, int levelIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public float getExperienceBar()`
- `public int getTotalExperience()`
- `public int getLevel()`