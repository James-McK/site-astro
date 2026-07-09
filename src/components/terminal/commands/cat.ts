import { type envType } from "../data";
import { printTermLine, printImage } from "../terminal";
import { checkOptionsFromArgs, tryParsePath, getObjAtPath, type optionType } from "./jsh";

export default async function cat(_env: envType, ...args: string[]) {
	const availableOptions = [
		{ name: "help", long: "--help", short: "", takesArg: false },
		{ name: "version", long: "--version", short: "", takesArg: false },
		{
			name: "numberNonBlank",
			long: "--number-nonblank",
			short: "-b",
			takesArg: false,
		},
		{ name: "showEnds", long: "--show-ends", short: "-E", takesArg: false },
		{ name: "numberLines", long: "--number", short: "-n", takesArg: false },
		{
			name: "squeezeBlank",
			long: "--squeeze-blank",
			short: "-s",
			takesArg: false,
		},
		{ name: "ignored", long: "", short: "-u", takesArg: false }, // easiest feature to implement
	] as optionType[];

	const parsedParts = await checkOptionsFromArgs(args, availableOptions, "cat");

	if (!parsedParts) return 1;

	const options = parsedParts.options;
	args = parsedParts.nonOptionArgs;

	if (options.help) {
		printTermLine(`Usage: cat [OPTION]... [FILE]...
Concatenate FILE(s) to standard output.

  -b, --number-nonblank    number nonempty output lines, overrides -n
  -E, --show-ends          display $ at end of each line
  -n, --number             number all output lines
  -s, --squeeze-blank      suppress repeated empty output lines
  -u                       (ignored)
      --help        display this help and exit
      --version     output version information and exit`);
		return 0;
	}

	if (options.version) {
		printTermLine(`cat (jsh) 0.1.2`);
		return 0;
	}

	const files = args;
	if (files.length === 0) {
		printTermLine("cat: No files specified\n(will handle reading from stdin in the future)");
		return 1;
	}

	for (const file of files) {
		let exitCode = await catFile(options, file);
		if (exitCode !== 0) return exitCode;
	}

	return 0;
}

async function catFile(options: Record<string, string | boolean>, file: string) {
	const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "avif"];
	const fullFilePath = tryParsePath(file);

	const obj = getObjAtPath(fullFilePath);

	if (!obj) {
		printTermLine(`cat: ${file}: No such file or directory`);
		return 1;
	}

	if (typeof obj === "object") {
		printTermLine(`cat: ${file}: Is a directory`);
		return 1;
	}

	if (typeof obj === "function") {
		await catText(obj.toString(), options);
	} else if (typeof obj === "string") {
		const extension = file.split(".")?.pop()!;

		if (imageExtensions.includes(extension)) {
			printImage(obj);
		} else {
			await catText(obj, options);
		}
	} else {
		printTermLine("File type not supported!");
	}

	return 0;
}

async function catText(text: string, options: Record<string, string | boolean>) {
	let lineNum = 1;
	let lastLineWasBlank = false;

	let textToPrint = [] as string[];

	for (let line of text.split("\n")) {
		if (options.squeezeBlank && lastLineWasBlank && line.trim() === "") {
			continue;
		}

		lastLineWasBlank = line.trim() === "";

		if (options.numberNonBlank) {
			if (line.trim() === "") {
				textToPrint.push(line);
			} else {
				line = `  ${lineNum} ${line}`;
				lineNum++;
			}
		} else if (options.numberLines) {
			line = `  ${lineNum} ${line}`;
			lineNum++;
		}

		if (options.showEnds) {
			line += "$";
		}

		textToPrint.push(line);
	}

	printTermLine(textToPrint.join("\n"));
}
