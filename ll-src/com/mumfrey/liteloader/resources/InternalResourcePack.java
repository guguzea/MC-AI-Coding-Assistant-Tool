/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.resources;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.Set;

import net.minecraft.client.resources.IResourcePack;
import net.minecraft.client.resources.data.IMetadataSection;
import net.minecraft.client.resources.data.MetadataSerializer;
import net.minecraft.util.ResourceLocation;

/**
 * Resource pack which returns resources using Class::getResourceAsStream() on
 * the specified class.
 * 
 * @author Adam Mummery-Smith
 */
public class InternalResourcePack implements IResourcePack
{
    /**
     * Domains supported by this resource pack
     */
    private final Set<String> resourceDomains = new HashSet<String>();

    /**
     * Name of this resource pack
     */
    private final String packName;

    /**
     * Class to execute getResourceAsStream() upon
     */
    private final Class<?> resourceClass;

    /**
     * @param name
     * @param resourceClass
     * @param domains
     */
    public InternalResourcePack(String name, Class<?> resourceClass, String... domains)
    {
        if (domains.length < 1) throw new IllegalArgumentException("No domains specified for internal resource pack");

        this.packName = name;
        this.resourceClass = resourceClass;

        for (String domain : domains)
        {
            this.resourceDomains.add(domain);
        }
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.resources.IResourcePack
     *      #getInputStream(net.minecraft.util.ResourceLocation)
     */
    @Override
    public InputStream func_110590_a(ResourceLocation resourceLocation) throws IOException
    {
        return this.getResourceStream(resourceLocation);
    }

    /**
     * @param resourceLocation
     */
    private InputStream getResourceStream(ResourceLocation resourceLocation)
    {
        return this.resourceClass.getResourceAsStream(String.format("/assets/%s/%s",
                resourceLocation.func_110624_b(), resourceLocation.func_110623_a()));
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.resources.IResourcePack#resourceExists(
     *      net.minecraft.util.ResourceLocation)
     */
    @Override
    public boolean func_110589_b(ResourceLocation resourceLocation)
    {
        return this.getResourceStream(resourceLocation) != null;
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.resources.IResourcePack#getResourceDomains()
     */
    @Override
    public Set<String> func_110587_b()
    {
        return this.resourceDomains;
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.resources.IResourcePack#getPackMetadata(
     *      net.minecraft.client.resources.data.IMetadataSerializer,
     *      java.lang.String)
     */
    @Override
    public <T extends IMetadataSection> T func_135058_a(MetadataSerializer par1MetadataSerializer, String par2Str) throws IOException
    {
        return null;
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.resources.IResourcePack#getPackImage()
     */
    @Override
    public BufferedImage func_110586_a() throws IOException
    {
        return null;
    }

    /* (non-Javadoc)
     * @see net.minecraft.client.resources.IResourcePack#getPackName()
     */
    @Override
    public String func_130077_b()
    {
        return this.packName;
    }
}
