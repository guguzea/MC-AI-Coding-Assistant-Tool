# S3CPacketUpdateScore

## Class signature

```java
public class S3CPacketUpdateScore extends java.lang.Object implements Packet < INetHandlerPlayClient >
```

## Constructors

- `public S3CPacketUpdateScore()`
- `public S3CPacketUpdateScore( Score scoreIn)`
- `public S3CPacketUpdateScore(java.lang.String nameIn)`
- `public S3CPacketUpdateScore(java.lang.String nameIn, ScoreObjective objectiveIn)`

## Methods

- `public void readPacketData( PacketBuffer buf) throws java.io.IOException`
- `public void writePacketData( PacketBuffer buf) throws java.io.IOException`
- `public void processPacket( INetHandlerPlayClient handler)`
- `public java.lang.String getPlayerName()`
- `public java.lang.String getObjectiveName()`
- `public int getScoreValue()`
- `public S3CPacketUpdateScore.Action getScoreAction()`

## Description

Passes this Packet on to the NetHandler for processing.