import { type envType, type Directory } from "../data";
import { printTermLine } from "../terminal";
import { checkOptionsFromArgs, getObjAtPath, tryParsePath, type optionType } from "./jsh";

export default async function ls(_env: envType, ...args: string[]) {
	const availableOptions = [
		{ name: "help", long: "--help", short: "", takesArg: false },
		{ name: "version", long: "--version", short: "", takesArg: false },
		{ name: "all", long: "--all", short: "-a", takesArg: false },
		{ name: "almostAll", long: "--almost-all", short: "-A", takesArg: false },
	] as optionType[];

	const parsedParts = await checkOptionsFromArgs(args, availableOptions, "ls");

	if (!parsedParts) return 2;

	const options = parsedParts.options;
	args = parsedParts.nonOptionArgs;

	if (options.help) {
		printTermLine(`Usage: ls [OPTION]... [FILE]...
List information about the FILEs (the current directory by default).

Mandatory arguments to long options are mandatory for short options too.
  -a, --all                  do not ignore entries starting with .
  -A, --almost-all           do not list implied . and ..
      --help                 display this help and exit
      --version              output version information and exit
			
Exit status:
 0  if OK,
 1  if minor problems (e.g., cannot access subdirectory),
 2  if serious trouble (e.g., cannot access command-line argument).`);
		return 0;
	}

	if (options.version) {
		printTermLine(`ls (jsh) 1.0.2`);
		return 0;
	}

	const path = tryParsePath(args[0]);
	let obj = getObjAtPath(path) as Directory;

	let allContents = Object.keys(obj);

	if (!options.all && !options.almostAll) {
		allContents = allContents.filter((content) => content[0] !== ".");
	}

	let dirs = allContents.filter((key) => typeof obj[key] === "object");
	let files = allContents.filter((key) => typeof obj[key] !== "object");

	if (options.all) {
		// add .. and . to the list of directories
		dirs = [".", "..", ...dirs];
	}

	let contents = "";
	if (dirs.length > 0) contents += dirs.join("/ ") + "/ ";
	contents += files.join(" ");

	printTermLine(contents);

	return 0;
}
