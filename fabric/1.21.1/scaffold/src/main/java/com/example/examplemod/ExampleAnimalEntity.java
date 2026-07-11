package com.example.examplemod;

import net.fabricmc.api.EnvType;
import net.fabricmc.api.Environment;
import net.minecraft.entity.EntityData;
import net.minecraft.entity.EntityType;
import net.minecraft.entity.SpawnReason;
import net.minecraft.entity.ai.goal.FollowParentGoal;
import net.minecraft.entity.ai.goal.LookAroundGoal;
import net.minecraft.entity.ai.goal.SwimGoal;
import net.minecraft.entity.ai.goal.WanderAroundFarGoal;
import net.minecraft.entity.attribute.DefaultAttributeContainer;
import net.minecraft.entity.attribute.EntityAttributes;
import net.minecraft.entity.mob.MobEntity;
import net.minecraft.entity.passive.AnimalEntity;
import net.minecraft.entity.passive.CowEntity;
import net.minecraft.nbt.NbtCompound;
import net.minecraft.registry.RegistryKeys;
import net.minecraft.registry.RegistryWrapper;
import net.minecraft.server.world.ServerWorld;
import net.minecraft.world.World;
import net.minecraft.world.WorldAccess;
import org.jetbrains.annotations.Nullable;

public class ExampleAnimalEntity extends CowEntity {
    public ExampleAnimalEntity(EntityType<? extends ExampleAnimalEntity> entityType, World world) {
        super(entityType, world);
    }

    @Override
    protected void initGoals() {
        this.goalSelector.add(0, new SwimGoal(this));
        this.goalSelector.add(1, new FollowParentGoal(this, 1.1));
        this.goalSelector.add(2, new WanderAroundFarGoal(this, 2.0));
        this.goalSelector.add(3, new LookAroundGoal(this));
    }

    @Override
    @Nullable
    public EntityData initialize(ServerWorldAccess world, LocalDifficulty difficulty,
                                SpawnReason spawnReason,
                                @Nullable EntityData entityData,
                                @Nullable NbtCompound nbt) {
        return super.initialize(world, difficulty, spawnReason, entityData, nbt);
    }

    public static DefaultAttributeContainer.Builder createExampleAttributes() {
        return AnimalEntity.createAnimalAttributes()
                .add(EntityAttributes.GENERIC_MAX_HEALTH, 10.0)
                .add(EntityAttributes.GENERIC_MOVEMENT_SPEED, 0.2);
    }

    @Override
    public boolean isBreedingItem(net.minecraft.item.ItemStack stack) {
        return false;
    }
}
