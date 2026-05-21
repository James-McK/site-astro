import { type envType } from "../data";
import { printTermLine } from "../terminal";
import {
	checkOptionsFromArgs,
	tryParsePath,
	getObjAtPath,
	type optionType,
} from "./jsh";

export default async function tree(_env: envType, ...args: string[]) {
	const availableOptions = [
		{ name: "help", long: "--help", short: "", takesArg: false },
		{ name: "version", long: "--version", short: "", takesArg: false },
		// listing options
		// { name: "includeHidden", long: "", short: "-a", takesArg: false }, // TODO includeHidden
		{ name: "dirsOnly", long: "", short: "-d", takesArg: false },
		{ name: "fullPathPrefix", long: "", short: "-f", takesArg: false },
		{ name: "levelLimit", long: "", short: "-L", takesArg: true },
		// { name: "rerunOnMaxDepth", long: "", short: "-R", takesArg: false }, // TODO rerunOnMaxDepth
		{ name: "pruneEmptyDirs", long: "--prune", short: "", takesArg: false },
		// file options
		{ name: "quoteFileNames", long: "", short: "-Q", takesArg: false },
		// XML/JSON options (not implemented)
		// { name: "xml", long: "", short: "-X", takesArg: false },
		// { name: "json", long: "", short: "-J", takesArg: false },
	] as optionType[];

	const parsedParts = await checkOptionsFromArgs(
		args,
		availableOptions,
		"tree"
	);

	if (!parsedParts) return 2;

	const options = parsedParts.options;
	args = parsedParts.nonOptionArgs;

	if (options.help) {
		printTermLine(`usage: tree [-dfQ] [-L level] [--prune] [directory ...]
  ------- Listing options -------
  -d         List directories only.
  -f         Print the full path prefix for each file.
  -L level   Descend only level directories deep.
  --prune    Prune empty directories from the output.
  ------- File options -------
  -Q         Quote filenames with double quotes.
  ------- Miscellaneous options -------
  --version     Print version and exit.
  --help        Print usage and this help message and exit.`);
		return 0;
	}

	if (options.version) {
		printTermLine(`tree (jsh) 0.1.0`);
		return 0;
	}

	let path = args[0];
	path = tryParsePath(path);

	printTermLine(`.${await treeDir(path, options)}`);

	return 0;
}

async function treeDir(
	path: string,
	options: Record<string, string | boolean>,
	level = 1
) {
	const levelLimit = parseInt(options.levelLimit as string) || Infinity;
	path = tryParsePath(path);
	const obj = getObjAtPath(path);
	if (!obj || typeof obj !== "object") return "";

	const items = Object.keys(obj);

	let tree = "";
	for (let i = 0; i < items.length; i++) {
		const itemName = items[i];
		const item = obj[itemName];
		if (options.dirsOnly && typeof item !== "object") continue;
		if (options.pruneEmptyDirs && typeof item === "object") {
			const subItems = Object.keys(item);
			if (subItems.length === 0) continue;
		}
		const isLast = i === items.length - 1;
		const connector = isLast ? "└──" : "├──";
		const pathPrefix = (options.fullPathPrefix ? `${path}/` : "").replace(
			"//",
			"/"
		);
		let nameToPrint = `${pathPrefix}${itemName}`;
		if (options.quoteFileNames) nameToPrint = `"${nameToPrint}"`;
		tree += `\n${connector} ${nameToPrint}`;

		if (
			typeof item === "object" &&
			Object.keys(item).length > 0 &&
			level < levelLimit
		) {
			const newPath = `${path}/${itemName}`;
			const isLastDir = i === items.length - 1;
			const indented = await indentTree(
				await treeDir(newPath, options, level + 1),
				isLastDir
			);
			tree += `\n${indented}`;
		}
	}

	return tree;
}

async function indentTree(tree: string, isLast: boolean) {
	const lines = tree.split("\n").filter((line) => line.trim() !== "");
	const indent = isLast ? "    " : "│   ";
	const indented = lines.map((line) => `${indent}${line}`).join("\n");
	return `${indented}`;
}
