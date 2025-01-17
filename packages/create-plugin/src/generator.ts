"use strict";

import * as fs from "fs";
import { globSync } from "glob";
import * as path from "path";
import { installDependencies } from "./deps";
import type { Lang } from "./lang";
import type { Manifest } from "./manifest";
import { generatePrivateKey } from "./privateKey";
import type { TemplateType } from "./template";
import { isNecessaryFile, processTemplateFile } from "./template";
import normalize from "normalize-path";

/**
 * Create a plugin project based on passed manifest and install dependencies
 * @param outputDirectory
 * @param manifest
 * @param lang
 * @param enablePluginUploader
 * @param templateType
 */
export const generatePlugin = (
  outputDirectory: string,
  manifest: Manifest,
  lang: Lang,
  enablePluginUploader: boolean,
  templateType: TemplateType
): void => {
  // copy and build a project into the output diretory
  buildProject(outputDirectory, manifest, enablePluginUploader, templateType);
  // npm install
  installDependencies(outputDirectory, lang);
};

/**
 * Create a plugin project based on passed manifest
 * @param outputDirectory
 * @param manifest
 * @param enablePluginUploader
 * @param templateType
 */
const buildProject = (
  outputDirectory: string,
  manifest: Manifest,
  enablePluginUploader: boolean,
  templateType: TemplateType
): void => {
  fs.mkdirSync(outputDirectory);
  // This is necessary for unit testing
  // We use src/generator.ts directory instead of dist/src/generator.js when unit testing
  const templatePath =
    __dirname.indexOf("dist") === -1
      ? path.join(__dirname, "..", "templates", templateType)
      : path.join(__dirname, "..", "..", "templates", templateType);
  const templatePathPattern = normalize(path.resolve(templatePath, "**", "*"));
  globSync(templatePathPattern, {
    dot: true,
  })
    .filter((file) => isNecessaryFile(manifest, file))
    .forEach((file) =>
      processTemplateFile(
        file,
        templatePath,
        outputDirectory,
        manifest,
        enablePluginUploader
      )
    );
  fs.writeFileSync(
    path.resolve(outputDirectory, "private.ppk"),
    generatePrivateKey()
  );
  fs.writeFileSync(
    path.resolve(
      outputDirectory,
      templateType === "modern" ? "plugin" : "src",
      "manifest.json"
    ),
    JSON.stringify(manifest, null, 2)
  );
};
