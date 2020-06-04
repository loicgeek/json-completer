// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

const FOLDER_PATH = vscode.workspace.rootPath;
const CONFIG_FILE_NAME = ".jcompleter.config";
const CONFIG_PATH = path.join(FOLDER_PATH, CONFIG_FILE_NAME);
let CONFIG;
let MODEL_PATH;
let accepted_functions_STRING;
let KEYS_LIST;
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

const loadConfig = () => {
  if (!fs.existsSync(CONFIG_PATH)) {
    vscode.window.showErrorMessage(
      "config file " + CONFIG_FILE_NAME + " not found"
    );
  }
  let rawdata = fs.readFileSync(CONFIG_PATH, {
    encoding: "utf-8",
  });
  try {
    CONFIG = JSON.parse(rawdata);
  } catch (e) {
    vscode.window.showErrorMessage(e.toString());
    return;
  }

  if (CONFIG["model_path"] == null) {
    vscode.window.showErrorMessage(
      "field 'model_path' not found in" + CONFIG_FILE_NAME
    );
  } else {
    console.log("config loaded");
    return CONFIG;
  }
};

const loadData = () => {
  MODEL_PATH = path.join(FOLDER_PATH, CONFIG["model_path"]);
  var translateFunctions;
  if (
    CONFIG["accepted_functions"] != null &&
    CONFIG["accepted_functions"].length > 1
  ) {
    translateFunctions = CONFIG["accepted_functions"];
  } else {
    translateFunctions = ["AllTranslations.text"];
  }
  accepted_functions_STRING = "(" + translateFunctions.join("|") + ")";
  let jsonData = fs.readFileSync(MODEL_PATH, {
    encoding: "utf-8",
  });
  KEYS_LIST = getObjectKeys(JSON.parse(jsonData));
  console.log("data loaded");
  return KEYS_LIST;
};

//this method is called when user save a file
// it check whether it is config or model file, in that case,
// we reload data
vscode.workspace.onDidSaveTextDocument((document) => {
  const absolute_model_path = path.join(
    vscode.workspace.rootPath,
    CONFIG["model_path"]
  );

  if (
    document.fileName == CONFIG_PATH ||
    document.fileName == absolute_model_path
  ) {
    loadConfig();
    loadData();
  }
});

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("json-completer successfully activated");
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  loadConfig();
  loadData();
  let jsonCompleterProvider = vscode.languages.registerCompletionItemProvider(
    {
      pattern: "**",
    },
    {
      async provideCompletionItems(document, position) {
        var line = document.lineAt(position);
        const linePrefix = line.text.substr(0, position.character);
        var regex = accepted_functions_STRING + '\\("(.*)"\\)';

        //Converting single quotes to double quotes
        var re = new RegExp("'", "g");
        var match = RegExp(regex).exec(line.text.replace(re, '"'));

        if (match === null || match.length < 3) {
          return undefined;
        }
        var matchedText = match[2];

        try {
          var filteredList = KEYS_LIST.filter((x) => {
            return x.startsWith(matchedText);
          });
          var result = filteredList.map((item) => {
            const snippetCompletion = new vscode.CompletionItem(item);
            //make sure to move the cursor at the right position
            let startPosition = new vscode.Position(
              line.lineNumber,
              position.character - matchedText.length
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
        console.log("configuration changed");
        loadConfig();
        loadData();
        return undefined;
      },
    },
    ":",
    "'",
    '"',
    ","
  );

  context.subscriptions.push(jsonCompleterProvider, configChangedProvider);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
