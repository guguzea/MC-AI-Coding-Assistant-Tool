package com.mumfrey.webprefs.framework;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;
import com.mumfrey.webprefs.interfaces.IWebPreferencesResponse;

class WebPreferencesResponse implements IWebPreferencesResponse
{
    private static final long serialVersionUID = 1L;
    
    private static final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    
    @Expose @SerializedName("response")
    private String response;

    @Expose @SerializedName("message")
    private String message;

    @Expose @SerializedName("uuid")
    private String uuid;

    @Expose @SerializedName("serverid")
    private String serverId;

    @Expose @SerializedName("rate")
    private int rateLimit;

    @Expose @SerializedName("get")
    private Map<String, String> get;

    @Expose @SerializedName("set")
    private List<String> set;

    private transient Throwable th;

    public WebPreferencesResponse() {}

    private WebPreferencesResponse(String response, Throwable th)
    {
        this.response = response;
        this.th = th;
    }

    @Override
    public String getResponse()
    {
        return this.response;
    }

    @Override
    public String getMessage()
    {
        return this.message;
    }

    @Override
    public Throwable getThrowable()
    {
        return this.th;
    }

    @Override
    public String getUUID()
    {
        return this.uuid;
    }

    @Override
    public String getServerId()
    {
        return this.serverId;
    }

    @Override
    public boolean hasValues()
    {
        return this.get != null;
    }

    @Override
    public Map<String, String> getValues()
    {
        return this.get;
    }

    @Override
    public boolean hasSetters()
    {
        return this.set != null;
    }

    @Override
    public Set<String> getSetters()
    {
        return new HashSet<String>(this.set);
    }

    public static IWebPreferencesResponse fromJson(String json)
    {
        try
        {
            return WebPreferencesResponse.gson.fromJson(json, WebPreferencesResponse.class);
        }
        catch (JsonSyntaxException ex)
        {
            return new WebPreferencesResponse("500 Invalid JSON", ex);
        }
        catch (Throwable th)
        {
            return new WebPreferencesResponse("500 Invalid JSON", th);
        }
    }

    @Override
    public String toString()
    {
        try
        {
            return WebPreferencesResponse.gson.toJson(this);
        }
        catch (Throwable th)
        {
            return "{\"Invalid JSON\"}";
        }
    }
}
