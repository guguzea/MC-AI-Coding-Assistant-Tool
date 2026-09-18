# BiomeEvent

## Class signature

```java
public class BiomeEvent extends Event
```

## Constructors

- `public BiomeEvent( BiomeGenBase biome)`

## Description

BiomeEvent is fired whenever an event involving biomes occurs. If a method utilizes this Event as its parameter, the method will receive every child event of this class. All children of this event are