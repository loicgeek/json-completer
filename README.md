# json-completer

Json-completer is a vscode extension that allows developper to autocomplete nested object from a json file.

## Features

[![Watch the video](https://img.youtube.com/vi/1-2_dN9wtNY/maxresdefault.jpg)](https://youtu.be/1-2_dN9wtNY)

## Requirements

> You should configure the .jcompleter.config file at the root of your project. This file must give the path to you model json file

`{ "model_path":"locales/locale_en.json", "accepted_functions":["AllTranslation.text","translate"] //optional }`

## `accepted_functions` parameter let user choose which functions he want this plugin to suggest json completion for.

## activate the extension by running the command "json-completer.activate"
