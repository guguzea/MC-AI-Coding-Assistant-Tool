/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.client.overlays;

import net.minecraft.util.ResourceLocation;

/**
 * Adapter for EntityRenderer to expose some private functionality
 *
 * @author Adam Mummery-Smith
 */
public interface IEntityRenderer
{
    public abstract boolean getUseShader();
    public abstract void setUseShader(boolean useShader);

    public abstract ResourceLocation[] getShaders();

    public abstract int getShaderIndex();
    public abstract void setShaderIndex(int shaderIndex);

    public abstract void selectShader(ResourceLocation shader);

    public abstract float getFOV(float partialTicks, boolean armFOV);

    public abstract void setupCamera(float partialTicks, int pass);
}
