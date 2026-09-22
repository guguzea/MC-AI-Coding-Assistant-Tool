# Particle

**Inheritance:** java.lang.Object → net.minecraft.client.particle.Particle

## Class signature

```java
public class Particle extends java.lang.Object
```

## Constructors

- `Particle(World worldIn, double posXIn, double posYIn, double posZIn)`
- `Particle(World worldIn, double xCoordIn, double yCoordIn, double zCoordIn, double xSpeedIn, double ySpeedIn, double zSpeedIn)`

## Methods

- `float getBlueColorF()`
- `int getBrightnessForRender(float p_189214_1_)`
- `AxisAlignedBB getEntityBoundingBox()`
- `int getFXLayer()`
- `float getGreenColorF()`
- `float getRedColorF()`
- `boolean isAlive()`
- `boolean isTransparent()`
- `void moveEntity(double x, double y, double z)`
- `Particle multipleParticleScaleBy(float scale)`
- `Particle multiplyVelocity(float multiplier)`
- `void nextTextureIndexX()`
- `void onUpdate()`
- `void renderParticle(VertexBuffer worldRendererIn, Entity entityIn, float partialTicks, float rotationX, float rotationZ, float rotationYZ, float rotationXY, float rotationXZ)`
- `protected void resetPositionToBB()`
- `void setAlphaF(float alpha)`
- `void setEntityBoundingBox(AxisAlignedBB bb)`
- `void setExpired()`
- `void setMaxAge(int p_187114_1_)`
- `void setParticleTexture(TextureAtlasSprite texture)`
- `void setParticleTextureIndex(int particleTextureIndex)`
- `void setPosition(double p_187109_1_, double p_187109_3_, double p_187109_5_)`
- `void setRBGColorF(float particleRedIn, float particleGreenIn, float particleBlueIn)`
- `protected void setSize(float p_187115_1_, float p_187115_2_)`
- `java.lang.String toString()`

## Fields

- `static Vec3d cameraViewDir`
- `protected boolean canCollide`
- `protected float height`
- `static double interpPosX`
- `static double interpPosY`
- `static double interpPosZ`
- `protected boolean isCollided`
- `protected boolean isExpired`
- `protected double motionX`
- `protected double motionY`
- `protected double motionZ`
- `protected int particleAge`
- `protected float particleAlpha`
- `protected float particleAngle`
- `protected float particleBlue`
- `protected float particleGravity`
- `protected float particleGreen`
- `protected int particleMaxAge`
- `protected float particleRed`
- `protected float particleScale`
- `protected TextureAtlasSprite particleTexture`
- `protected int particleTextureIndexX`
- `protected int particleTextureIndexY`
- `protected float particleTextureJitterX`
- `protected float particleTextureJitterY`
- `protected double posX`
- `protected double posY`
- `protected double posZ`
- `protected float prevParticleAngle`
- `protected double prevPosX`
- `protected double prevPosY`
- `protected double prevPosZ`
- `protected java.util.Random rand`
- `protected float width`
- `protected World worldObj`