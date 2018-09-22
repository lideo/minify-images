# Description

A very simple script that optimizes large jpg and png images in a given folder. 

It uses the [Sharp](https://github.com/lovell/sharp) Node module for the optimization.

## Installation

    npm install

## Usage

Save the original images in the `/src/img` folder.

    npm run minify
    
The optimized files will be copied to a folder called `/img`. 

It also makes a copy of the images that don't need optimization.

    
