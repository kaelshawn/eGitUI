
# From https://github.com/cmake-js/cmake-js/wiki/TUTORIAL-01-Creating-a-native-module-by-using-CMake.js-and-NAN

cmake_minimum_required(VERSION 4.3)

# Name of the project (will be the name of the plugin)
project(git-helper LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

if (MSVC)
    add_compile_options(/std:c++20 /Zc:__cplusplus)
elseif (CMAKE_CXX_COMPILER_ID MATCHES "Clang" OR CMAKE_CXX_COMPILER_ID STREQUAL "GNU")
    add_compile_options(-std=c++20)
endif()

add_definitions(
    -DV8_COMPRESS_POINTERS
    -DV8_REVERSE_JSARGS
    -DV8_COMPRESS_POINTERS_IN_ISOLATE_CAGE
)

# Build a shared library named after the project from the files in `src/`
file(GLOB SOURCE_FILES "src/addons/*.cc" "src/addons/*.hh")
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

# Gives our library file a .node extension without any "lib" prefix
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# Essential include files to build a node addon,
# You should add this line in every CMake.js based project
if(DEFINED CMAKE_JS_INC)
    target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC})
else()
    find_path(NODE_INCLUDE_DIR node_api.h
        HINTS
            $ENV{NODE_INCLUDE_DIR}
            $ENV{ProgramFiles}/nodejs/include/node
            $ENV{ProgramFiles(x86)}/nodejs/include/node
            /usr/include/node
            /usr/local/include/node
            $ENV{HOME}/.node-gyp
    )
    if(NODE_INCLUDE_DIR)
        target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_INCLUDE_DIR})
    else()
        message(WARNING "Could not find node_api.h. Configure this project with cmake-js or install the Node.js development headers.")
    endif()
endif()

# Essential library files to link to a node addon
# You should add this line in every CMake.js based project
if(DEFINED CMAKE_JS_LIB)
    target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})
endif()
