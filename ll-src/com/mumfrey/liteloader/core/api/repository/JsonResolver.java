/*
 * This file is part of LiteLoader.
 * Copyright (C) 2012-16 Adam Mummery-Smith
 * All Rights Reserved.
 */
package com.mumfrey.liteloader.core.api.repository;

import java.io.File;
import java.io.FileReader;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import com.google.common.base.Strings;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.SerializedName;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger;
import com.mumfrey.liteloader.util.log.LiteLoaderLogger.Verbosity;

/**
 * Modlist JSON resolver
 */
public final class JsonResolver
{
    /**
     * Gson object for deserialisation
     */
    private static final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    
    /**
     * Root resolver, used as parent for resolvers with no parent
     */
    private static final JsonResolver rootResolver = new JsonResolver().setRoot();

    @SerializedName("repositoryRoot")
    private String repositoryRoot;
    
    @SerializedName("modRef")
    private List<String> modRefs;
    
    @SerializedName("parentList")
    private String parentList;
    
    /**
     * True when resolving, used to prevent accidental re-entrance if a config
     * is defined as its own parent!
     */
    private transient boolean resolving = false;
    
    /**
     * JSON file in the file system
     */
    private transient File file;
    
    /**
     * Resolved repository root
     */
    private transient File root;
    
    /**
     * Resolved parent
     */
    private transient JsonResolver parent;
    
    /**
     * Resolved artefacts
     */
    private final transient Map<String, Artefact> artefacts = new TreeMap<String, Artefact>(); 
    
    private JsonResolver()
    {
    }
    
    /**
     * Configure this resolver as the root resolver
     */
    private JsonResolver setRoot()
    {
        this.parent = this;
        return this;
    }

    /**
     * Set the source file, called by the deserialisation routine
     * 
     * @param file JSON file
     * @return fluent
     */
    JsonResolver setFile(File file)
    {
        this.file = file;
        return this;
    }
    
    boolean isResolved()
    {
        return this.parent != null;
    }
    
    boolean isResolving()
    {
        return this.resolving;
    }
    
    /**
     * Get resolved artefacts from this resolver
     */
    public Map<String, Artefact> getArtefacts()
    {
        return Collections.<String, Artefact>unmodifiableMap(this.artefacts);
    }
    
    /**
     * Resolve this modlist, resolves parents recursively as required
     * 
     * @param repository owning repository
     * @return fluent
     */
    JsonResolver resolve(Repository repository)
    {
        if (!this.isResolved() && !this.isResolving())
        {
            LiteLoaderLogger.info(Verbosity.REDUCED, "Resolving mods in repository %s", this);
            this.doResolve(repository);
        }
    
        return this;
    }

    private void doResolve(Repository repository)
    {
        this.resolving = true;
        this.root = this.resolveRoot(repository);

        JsonResolver parent = this.resolveParent(repository);
        if (parent.isResolving())
        {
            throw new IllegalStateException("Unexpected circular dependency in mod lists: " + this + " <-> " + parent);
        }
        
        this.artefacts.clear();
        this.artefacts.putAll(parent.artefacts);

        this.resolveArtefacts(repository);
        this.resolving = false;
        this.parent = parent;
    }

    private File resolveRoot(Repository repository)
    {
        if (this.repositoryRoot == null)
        {
            if (this.file != null)
            {
                return this.file.getParentFile();
            }
            
            return repository.getDefaultRepositoryRoot();
        }
        
        // Absolute path
        if (Repository.isAbsolutePath(this.repositoryRoot))
        {
            return new File(this.repositoryRoot);
        }
        
        // Relative path, relative to 
        return new File(repository.getRoot(), this.repositoryRoot);
    }

    private JsonResolver resolveParent(Repository repository)
    {
        if (this.parentList == null)
        {
            return JsonResolver.rootResolver;
        }
        
        if (Repository.isAbsolutePath(this.parentList))
        {
            File path = new File(this.parentList);
            return repository.getResolver(path).resolve(repository);
        }
        
        File path = new File(repository.getRoot(), this.parentList);
        return repository.getResolver(path).resolve(repository);
    }
    
    private void resolveArtefacts(Repository repository)
    {
        if (this.modRefs == null)
        {
            return;
        }
        
        for (String ref : this.modRefs)
        {
            if (Strings.isNullOrEmpty(ref))
            {
                continue;
            }
            
            try
            {
                Artefact artefact = new Artefact(ref);
                artefact.resolve(this.root);
                
                LiteLoaderLogger.info(Verbosity.VERBOSE, "Resolved artefact '%s' at %s", artefact.getArtefactId(), artefact.getFile());

                String artefactId = artefact.getArtefactId();
                Artefact existing = this.artefacts.get(artefactId);
                if (existing != null)
                {
                    LiteLoaderLogger.info(Verbosity.VERBOSE, "Evicting artefact '%s' -> '%s'", existing, artefact.getVersion());
                }
                
                this.artefacts.put(artefactId, artefact);
            }
            catch (IllegalArgumentException ex)
            {
                ex.printStackTrace();
            }
        }
    }

    /**
     * Deserialise a resolver from a JSON source using Gson
     * 
     * @param file file to read
     * @return deserialised resolver or new resolver if could not be read
     */
    static JsonResolver createFrom(File file)
    {
        if (file.isFile())
        {
            try (FileReader reader = new FileReader(file))
            {
                return JsonResolver.gson.fromJson(reader, JsonResolver.class).setFile(file);
            }
            catch (Exception ex)
            {
                ex.printStackTrace();
            }
        }

        return new JsonResolver().setFile(file);
    }

    @Override
    public String toString()
    {
        return this.file.getPath();
    }
}
