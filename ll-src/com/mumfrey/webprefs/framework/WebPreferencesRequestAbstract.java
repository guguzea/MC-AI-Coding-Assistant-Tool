package com.mumfrey.webprefs.framework;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

import net.minecraft.util.Session;

import com.google.gson.Gson;
import com.mumfrey.webprefs.exceptions.InvalidRequestException;
import com.mumfrey.webprefs.exceptions.InvalidRequestKeyException;
import com.mumfrey.webprefs.exceptions.InvalidRequestValueException;
import com.mumfrey.webprefs.exceptions.InvalidResponseException;
import com.mumfrey.webprefs.interfaces.IWebPreferencesRequest;
import com.mumfrey.webprefs.interfaces.IWebPreferencesResponse;
import com.mumfrey.webprefs.interfaces.IWebPreferencesServiceDelegate;

abstract class WebPreferencesRequestAbstract implements IWebPreferencesRequest
{
    private static final long serialVersionUID = 1L;

    private static final Pattern keyPattern = Pattern.compile("^[a-z0-9_\\-\\.]{1,32}$");

    private static final Gson gson = new Gson();

    private final transient URI uri;

    private final transient IWebPreferencesServiceDelegate delegate;
    
    private final transient String uuid;

    public WebPreferencesRequestAbstract(IWebPreferencesServiceDelegate delegate, String uuid)
    {
        if (delegate == null)
        {
            throw new IllegalArgumentException("Attempted to create a request with no delegate");
        }

        this.uri = URI.create(String.format("http://%s%s", delegate.getHostName(), this.getPath()));

        this.delegate = delegate;
        this.uuid = uuid;
    }

    protected abstract String getPath();
    
    @Override
    public IWebPreferencesServiceDelegate getDelegate()
    {
        return this.delegate;
    }

    @Override
    public URI getRequestURI()
    {
        return this.uri;
    }

    @Override
    public String getUUID()
    {
        return this.uuid;
    }

    @Override
    public Map<String, String> getPostVars()
    {
        Map<String, String> params = new HashMap<String, String>();
        this.addParams(params);
        return params;
    }

    protected void addParams(Map<String, String> params)
    {
        if (this.isValidationRequired())
        {
            Session session = this.getDelegate().getSession();
            if (session == null)
            {
                throw new InvalidRequestException(RequestFailureReason.NO_SESSION, "Request has no session");
            }

            params.put("u", session.func_111285_a());
        }

        params.put("i", this.uuid);
        params.put("j", this.toJson());
    }
    
    @Override
    public final void onReceivedResponse(IWebPreferencesResponse response)
    {
        if (response == null)
        {
            throw new InvalidResponseException(null, "Error reading server response");
        }
        
        if (response.getResponse().startsWith("500"))
        {
            throw new InvalidResponseException(RequestFailureReason.SERVER_ERROR,
                    "The server returned an invalid resonse: " + response.getResponse(), response.getThrowable());
        }

        if (!response.getResponse().startsWith("200"))
        {
            RequestFailureReason reason = RequestFailureReason.UNKNOWN;

            if (response.getResponse().startsWith("429")) reason = RequestFailureReason.THROTTLED;
            if (response.getResponse().startsWith("401")) reason = RequestFailureReason.UNAUTHORISED;

            String message = response.getMessage();
            throw new InvalidResponseException(reason, 
                    "The server responsed with " + response.getResponse() + (message != null ? " \"" + message + "\"" : ""));
        }

        if (!this.getUUID().equals(response.getUUID()))
        {
            throw new InvalidResponseException(RequestFailureReason.UUID_MISMATCH, "The response UUID did not match the request");
        }

        this.validateResponse(response);
    }
    
    protected abstract void validateResponse(IWebPreferencesResponse response);
    
    protected final void validateKey(String key)
    {
        if (key == null || !WebPreferencesRequestAbstract.keyPattern.matcher(key).matches())
        {
            throw new InvalidRequestKeyException("The specified key [" + key + "] is not valid");
        }
    }
    
    protected final void validateValue(String key, String value)
    {
        if (value == null || value.length() > 255)
        {
            throw new InvalidRequestValueException("The specified value [" + value + "] for key [" + key + "] is not valid");
        }
    }
    
    public String toJson()
    {
        return WebPreferencesRequestAbstract.gson.toJson(this);
    }

    @Override
    public String toString()
    {
        try
        {
            return WebPreferencesRequestAbstract.gson.toJson(this);
        }
        catch (Throwable th)
        {
            return "{\"Invalid JSON\"}";
        }
    }
}
