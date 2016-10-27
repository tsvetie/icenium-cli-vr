var fs = require("fs"),
    path = require("path"),
    childProcess = require("child_process"),
    shelljs = require("shelljs");

exports.build = (appId, appPath) => {
  var appName = path.basename(appPath);
  var outputPath = path.join(appPath, appName + ".apk");
  var unityAppPath = path.join(appPath, "platforms", "unity");
  var transpilerPath = path.join(appPath, "NsForVr.exe");

  if (!fs.existsSync(transpilerPath)) {
      shelljs.cp('-R', path.join(__dirname, "resources", "*"), appPath);
  }

  childProcess.execSync(transpilerPath);
  
  childProcess.execSync(`unity.exe -batchmode -quit -projectPath "${unityAppPath}"`);
  childProcess.execSync(`unity.exe -batchmode -quit -projectPath "${unityAppPath}" -executeMethod BuildService.AndroidBuild -outputPath "${outputPath}" -appId "${appId}" -appName "${appName}"`);

  return new Promise((resolve, reject) => {
      var interval = setInterval(() => {
        if (fs.existsSync(outputPath)) {
          clearInterval(interval);

          resolve(outputPath);
        }
      }, 100);
  });
}