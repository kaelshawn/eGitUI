#include <napi.h>
#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <git2.h>
using namespace std;

namespace GitAddonAPI
{

	/*
		Function to call stats generator function of c++ backend.
		To generate pattern categories, category data files, popularity of each category.
		@ param { string } projectDirectory Path to the Git project directory.
	*/
	std::string git_status_api(string projectDirectory = "");

	/*
		Wrapper for git_status_api() function. This wrapper is required to convert
		c++ datatypes into javascirpt form.
		This will check if passed arguments is a number.
	*/
	Napi::String git_status_wrapped(const Napi::CallbackInfo &info);

	// Export API
	Napi::Object Init(Napi::Env env, Napi::Object exports);
	NODE_API_MODULE(gitaddon, Init)
}