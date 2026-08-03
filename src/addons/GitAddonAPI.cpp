#include "GitAddonAPI.h"

// Working
std::string GitAddonAPI::git_status_api(string projectDirectory)
{
    string status = "Stats Generated";
    git_repository *repo = nullptr;
    int error = git_repository_open(&repo, projectDirectory.c_str());

    if (error == 0)
    {
        std::cout << "Successfully opened Git repository!\n";
        git_repository_free(repo);
    }
    else
    {
        const git_error *e = git_error_last();
        std::cerr << "Error opening repo: " << (e ? e->message : "Unknown error") << "\n";
        status = "Error opening repo: " + string(e ? e->message : "Unknown error");
    }

    // Clean up library resources
    git_libgit2_shutdown();
    return status;
}

Napi::String GitAddonAPI::git_status_wrapped(const Napi::CallbackInfo &info)
{
    /*
        Wrapper for git_status_api() function. This wrapper is required to convert
        c++ datatypes into javascirpt form.
        This will check if passed arguments is a number.
    */

    // next-generation-api(Napi) operations
    Napi::Env env = info.Env();

    // check if there is only one argument and it is a string.
    if (info.Length() != 1 || !info[0].IsString())
    {
        Napi::TypeError::New(env, "arg1::String expected").ThrowAsJavaScriptException();
    }

    // convert c++ datatype to javascripts
    Napi::String params = info[0].As<Napi::String>();

    // get c++ function return value and return it in javascript
    Napi::String returnValue = Napi::String::New(env, GitAddonAPI::git_status_api(params.Utf8Value()));

    return returnValue;
}

Napi::Object GitAddonAPI::Init(Napi::Env env, Napi::Object exports)
{
    // export stats function
    exports.Set("git_status_api", Napi::Function::New(env, GitAddonAPI::git_status_wrapped));

    return exports;
}