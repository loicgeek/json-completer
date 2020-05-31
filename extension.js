// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

const getObjectKeys = (obj, prefix = "") => {
  return Object.entries(obj).reduce((collector, [key, val]) => {
    const newKeys = [...collector, prefix ? `${prefix}.${key}` : key];

    if (Object.prototype.toString.call(val) === "[object Object]") {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      const otherKeys = getObjectKeys(val, newPrefix);
      return [...newKeys, ...otherKeys];
    }

    return newKeys;
  }, []);
};

const FOLDER_PATH = vscode.workspace.rootPath;
const CONFIG_FILE_NAME = ".jcompleter.config";
const CONFIG_PATH = path.join(FOLDER_PATH, CONFIG_FILE_NAME);
if (!fs.existsSync(CONFIG_PATH)) {
  vscode.window.showErrorMessage(
    "config file " + CONFIG_FILE_NAME + " not found"
  );
}
let rawdata = fs.readFileSync(CONFIG_PATH, {
  encoding: "utf-8",
});
const CONFIG = JSON.parse(rawdata);
if (CONFIG["model_path"] == null) {
  vscode.window.showErrorMessage(
    "field 'model_path' not found in" + CONFIG_FILE_NAME
  );
}
const MODEL_PATH = path.join(FOLDER_PATH, CONFIG["model_path"]);

var translateFunctions;
if (
  CONFIG["translate_functions"] != null &&
  CONFIG["translate_functions"].length > 1
) {
  translateFunctions = CONFIG["translate_functions"];
} else {
  translateFunctions = ["AllTranslations.text"];
}

const TRANSLATE_FUNCTIONS_STRING = translateFunctions.join("|");
let jsonData = fs.readFileSync(MODEL_PATH, {
  encoding: "utf-8",
});
let data = JSON.parse(jsonData);
var list = getObjectKeys(data);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  let flutterLangProvider = vscode.languages.registerCompletionItemProvider(
    {
      pattern: "**",
    },
    {
      async provideCompletionItems(document, position) {
        var line = document.lineAt(position);
        const linePrefix = line.text.substr(0, position.character);
        var regex = TRANSLATE_FUNCTIONS_STRING + '\\("(.*)"\\)';

        //Converting single quotes to double quotes
        var re = new RegExp("'", "g");
        var match = RegExp(regex).exec(line.text.replace(re, '"'));

        if (match === null || match.length === 1 || match[1] === null) {
          return undefined;
        }

        try {
          var filteredList = list.filter((x) => {
            return x.startsWith(match[1]);
          });
          console.log(filteredList);
          var result = filteredList.map((item) => {
            const snippetCompletion = new vscode.CompletionItem(item);
            //make sure to move the cursor at the right position
            let startPosition = new vscode.Position(
              line.lineNumber,
              position.character - match[1].length
            );
            snippetCompletion.range = new vscode.Range(startPosition, position);
            return snippetCompletion;
          });
          return result;
        } catch (e) {
          console.error(e);
        }
      },
    },
    ".",
    '"',
    "'"
    // triggered whenever a '.' is being typed
  );

  let configChangedProvider = vscode.languages.registerCompletionItemProvider(
    {
      pattern: "**/" + CONFIG_FILE_NAME,
    },
    {
      async provideCompletionItems(document, position) {
        var line = document.lineAt(position);
        const linePrefix = line.text.substr(0, position.character);

        return undefined;
      },
    },
    "."
  );

  context.subscriptions.push(flutterLangProvider);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
