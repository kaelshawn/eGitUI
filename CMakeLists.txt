cmake_minimum_required(VERSION 3.15)
cmake_policy(SET CMP0042 NEW)
set(CMAKE_CXX_STANDARD 17)

if(CMAKE_GENERATOR MATCHES "Visual Studio")
  set(CMAKE_VS_GLOBALS "VcpkgEnableManifest=true;VcpkgManifestInstall=true")
endif()

# Name of the project (will be the name of the plugin)
project(git-helper)

# 设置可执行文件（exe）的输出路径
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/addons/bin)

# 设置动态库（.so / .dll）的输出路径
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/addons/lib)
  
# 设置静态库（.a / .lib）的输出路径
set(CMAKE_ARCHIVE_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/addons/lib)

# Don't add this line if you will try_compile with boost.
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(WIN32 OR CMAKE_SYSTEM_NAME STREQUAL "Windows")
  if(CMAKE_GENERATOR MATCHES "Visual Studio")
    set(CMAKE_GENERATOR_PLATFORM x64)
    set(CMAKE_GENERATOR_TOOLSET "host=x64" CACHE STRING "Platform Toolset" FORCE)
  else()
    set(CMAKE_C_COMPILER clang-cl)
    set(CMAKE_CXX_COMPILER clang-cl)
  endif()
endif()

find_package(libgit2 CONFIG REQUIRED)

# Essential include files to build a node addon,
# you should add this line in every CMake.js based project.
include_directories(${CMAKE_JS_INC})

# Declare the location of the source files
file(GLOB SOURCE_FILES "src/addons/*.cpp" "src/addons/*.h")

# This line will tell CMake that we're building a shared library
# from the above source files
# named after the project's name
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})

# This line will give our library file a .node extension without any "lib" prefix
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# Essential library files to link to a node addon,
# you should add this line in every CMake.js based project.
target_link_libraries(${PROJECT_NAME} PRIVATE ${CMAKE_JS_LIB} libgit2::libgit2package)

# Include N-API wrappers
execute_process(COMMAND node -p "require('node-addon-api').include"
        WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
        OUTPUT_VARIABLE NODE_ADDON_API_DIR
        )
string(REPLACE "\n" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})

add_definitions(-DNAPI_VERSION=3)

install(TARGETS ${PROJECT_NAME} 
LIBRARY DESTINATION "${PROJECT_SOURCE_DIR}/resources/addons/lib"
ARCHIVE DESTINATION "${PROJECT_SOURCE_DIR}/resources/addons/lib"
RUNTIME DESTINATION "${PROJECT_SOURCE_DIR}/resources/addons/bin"
)

add_custom_command(TARGET ${PROJECT_NAME} POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    "${PROJECT_SOURCE_DIR}/addons/bin/Release/"
    "${PROJECT_SOURCE_DIR}/resources/addons/"
)

