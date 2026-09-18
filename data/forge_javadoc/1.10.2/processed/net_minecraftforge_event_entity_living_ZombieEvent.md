# ZombieEvent

## Class signature

```java
public class ZombieEvent extends EntityEvent
```

## Constructors

- `public ZombieEvent( EntityZombie entity)`

## Methods

- `public EntityZombie getSummoner()`

## Description

ZombieEvent is fired whenever a zombie is spawned for aid. If a method utilizes this Event as its parameter, the method will receive every child event of this class. All children of this event are fir