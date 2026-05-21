import { type envType } from "../data";
import { terminal, printTermLine } from "../terminal";
import { checkOptionsFromArgs, type optionType } from "./jsh";

const fetchInfoCopy = document.getElementById("fetch-row")!.cloneNode(true);

export default async function whoAmI(_env: envType, ...args: string[]) {
	const availableOptions = [
		{ name: "help", long: "--help", short: "", takesArg: false },
		{ name: "version", long: "--version", short: "", takesArg: false },
	] as optionType[];

	const parsedParts = await checkOptionsFromArgs(
		args,
		availableOptions,
		"whoami"
	);

	if (!parsedParts) return 2;

	const options = parsedParts.options;
	args = parsedParts.nonOptionArgs;

	if (options.help) {
		printTermLine(`Usage: whoami [OPTION]...
Print some information about the user.
Note: This is not the standard whoami command.

      --help        display this help and exit
      --version     output version information and exit`);

		return 0;
	}

	if (options.version) {
		printTermLine(`whoami (jsh) 1.0.0`);
		return 0;
	}

	terminal.appendChild(fetchInfoCopy.cloneNode(true));
	return 0;
}
