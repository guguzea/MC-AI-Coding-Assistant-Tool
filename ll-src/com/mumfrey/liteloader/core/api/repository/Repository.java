/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core.api.repository;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableList.Builder;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger.Verbosity;

/**
 * A mod container repository defined by JSON modlists
 */
public class Repository
{
    /**
     * Default root which relative paths are relative to, usually the game
     * directory
     */
    private final File root;
    
    /**
     * Fallback repository root in case things go wrong. Usually the versionsed
     * mods directory
     */
    private final File defaultRepositoryRoot;
    
    /**
     * Resolvers in this repository
     */
    private final Map<String, JsonResolver> resolvers = new TreeMap<String, JsonResolver>();
    
    /**
     * Global list of resolved artefacts
     */
    private final List<Artefact> artefacts = new ArrayList<Artefact>();

    public Repository(File root, File defaultRepositoryRoot)
    {
        this.root = root;
        this.defaultRepositoryRoot = defaultRepositoryRoot;
    }

    /**
     * Get the repository root, usually the game dir
     */
    public File getRoot()
    {
        return this.root;
    }
    
    /**
     * Get the default repository location, usually the versioned mods dir
     */
    public File getDefaultRepositoryRoot()
    {
        return this.defaultRepositoryRoot;
    }

    Map<String, JsonResolver> getResolvers()
    {
        return this.resolvers;
    }
    
    JsonResolver getResolver(File path)
    {
        String location = path.getAbsolutePath();
        JsonResolver resolver = this.resolvers.get(location);
        if (resolver == null)
        {
            resolver = JsonResolver.createFrom(path);
            this.resolvers.put(location, resolver);
        }
        return resolver;
    }
    
    /**
     * Resolve the specified modlist
     * 
     * @param path modlist path
     */
    public void resolve(File path)
    {
        JsonResolver resolver = this.getResolver(path);
        resolver.resolve(this);
        this.artefacts.addAll(resolver.getArtefacts().values());
    }
    
    /**
     * Get resolved artefacts from this repository
     */
    public Collection<Artefact> getArtefacts()
    {
        return Collections.<Artefact>unmodifiableList(this.artefacts);
    }
    
    /**
     * Get all resolved files in this repository
     */
    public Collection<File> getFiles()
    {
        Builder<File> files = ImmutableList.<File>builder();
        for (Artefact artefact : this.artefacts)
        {
            if (artefact.exists())
            {
                files.add(artefact.getFile());
            }
            else
            {
                LiteLoaderLogger.info(Verbosity.REDUCED, "Rejecting non-existent artefact %s at %s", artefact.getArtefactId(), artefact.getFile());
            }
        }
        return files.build();
    }

    static boolean isAbsolutePath(String path)
    {
        return path.matches("^([a-zA-Z]:[/\\\\]|/).+$");
    }
}
