// Simple art generator by HashLips <->

#include "./lib/json2.js";

function main() {
  var continueConfirmation = confirm(
    "You are about to use the HashLips art generator. Are you sure you want to continue?"
  );

  if (!continueConfirmation) return;

  var supply = prompt("How many images do you want to generate?", "10");

  var name = prompt("What is the name of your collection?", "");

  var description = prompt("What is the description for your collection?", "");

  alert(
    supply +
      " images will be generated, so sit back relax and enjoy the art being generated."
  );

  var groups = app.activeDocument.layerSets;

  resetLayers(groups);

  for (var h = 1; h < parseInt(supply) + 1; h++) {
    var obj = {};
    obj.name = name + " #" + h;
    obj.description = description;
    obj.image = "To be replaced";
    obj.edition = h;
    obj.attributes = [];
    for (var i = 0; i < groups.length; i++) {
      var ran = Math.floor(Math.random() * groups[i].layers.length);
      groups[i].layers[ran].visible = true;
      obj.attributes.push({
        trait_type: groups[i].name, 
        value: groups[i].layers[ran].name
      })
    }
    saveImage(obj.edition);
    saveMetadata(obj);
    resetLayers(groups);
  }
  alert("Generation process is complete.");
}

function resetLayers(_groups) {
  for (var i = 0; i < _groups.length; i++) {
    _groups[i].visible = true;
    for (var j = 0; j < _groups[i].layers.length; j++) {
      _groups[i].layers[j].visible = false;
    }
  }
}

function saveImage(_edition) {
  var saveFile = new File(toFolder("build/images") + "/" + _edition + ".png");
  exportOptions = new ExportOptionsSaveForWeb();
  exportOptions.format = SaveDocumentType.PNG;
  exportOptions.PNG24 = false;
  exportOptions.transparency = true;
  exportOptions.interlaced = false;
  app.activeDocument.exportDocument(
    saveFile,
    ExportType.SAVEFORWEB,
    exportOptions
  );
}

function saveMetadata(_data) {
  var file = new File(toFolder("build/metadata") + "/" + _data.edition + ".json");
  file.open("w");
  file.write(JSON.stringify(_data));
  file.close();
}

function toFolder(_name) {
  var path = app.activeDocument.path;
  var folder = new Folder(path + "/" + _name);
  if (!folder.exists) {
    folder.create();
  }
  return folder;
}


main();
