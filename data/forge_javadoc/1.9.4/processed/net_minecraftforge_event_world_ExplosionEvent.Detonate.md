# ExplosionEvent.Detonate

## Constructors

- `public Detonate( World world, Explosion explosion, java.util.List< Entity > entityList)`

## Methods

- `public java.util.List< BlockPos > getAffectedBlocks()`
- `public java.util.List< Entity > getAffectedEntities()`

## Description

ExplosionEvent.Detonate is fired once the explosion has a list of affected blocks and entities. These lists can be modified to change the outcome. This event is not Cancelable . This event does not us