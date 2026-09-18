# EntityStruckByLightningEvent

## Class signature

```java
public class EntityStruckByLightningEvent extends EntityEvent
```

## Constructors

- `public EntityStruckByLightningEvent( Entity entity, EntityLightningBolt lightning)`

## Methods

- `public EntityLightningBolt getLightning()`

## Description

EntityStruckByLightningEvent is fired when an Entity is about to be struck by lightening. This event is fired whenever an EntityLightningBolt is updated to strike an Entity in EntityLightningBolt#onUp