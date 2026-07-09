import { type envType } from "../data";
import { printTermLine } from "../terminal";
import { filesystem, getCurrentDir, type DirectoryItem } from "../data";

export type optionType = {
	name: string; // internal name
	long: string | undefined;
	short: string | undefined;
	takesArg: boolean;
};

export async function checkOptionsFromArgs(
	args: string[],
	availableOptions: optionType[],
	command: string,
) {
	const options = {} as Record<string, string | boolean>;
	const nonOptionArgs = [] as string[];

	// for long options (e.g. --all) they must be on their own
	// while short options (e.g. -a) may (rfc 2119) be grouped together

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		if (arg.startsWith("--")) {
			const option = availableOptions.find((opt) => opt.long === arg);

			if (!option) {
				printTermLine(`${command}: unrecognized option '${arg}'`);
				if (availableOptions.find((opt) => opt.long === "--help"))
					printTermLine(`Try '${command} --help' for more information.`);
				else if (availableOptions.find((opt) => opt.short === "-h"))
					printTermLine(`Try '${command} -h' for more information.`);
				return null;
			}

			if (option.takesArg) {
				options[option.name] = args[i + 1];
				i++;
			} else {
				options[option.name] = true;
			}
		} else if (arg.startsWith("-")) {
			const shortOptions = arg.slice(1).split("");
			for (const shortOption of shortOptions) {
				const option = availableOptions.find((opt) => opt.short === `-${shortOption}`);

				if (!option) {
					printTermLine(`${command}: unrecognized option '-${shortOption}'`);
					if (availableOptions.find((opt) => opt.long === "--help"))
						printTermLine(`Try '${command} --help' for more information.`);
					else if (availableOptions.find((opt) => opt.short === "-h"))
						printTermLine(`Try '${command} -h' for more information.`);
					return null;
				}

				if (option.takesArg) {
					options[option.name] = args[i + 1];
					i++;
				} else {
					options[option.name] = true;
				}
			}
		} else nonOptionArgs.push(arg);
	}

	return { options: options, nonOptionArgs: nonOptionArgs };
}

export function tryParsePath(path: string | undefined) {
	if (!path) path = getCurrentDir();
	if (path.startsWith("~")) path = `/home/autumn/${path.slice(1)}`;
	if (!path.startsWith("/")) path = `${getCurrentDir()}/${path}`;

	const parts = path.split("/");
	const parsedParts = [];

	for (let i = 0; i < parts.length; i++) {
		if (parts[i] === "") continue;
		if (parts[i] === ".") continue;
		if (parts[i] === "..") parsedParts.pop();
		else parsedParts.push(parts[i]);
	}

	return `/${parsedParts.join("/")}`;
}

export function getObjAtPath(path: string) {
	const parts = path.split("/");
	let obj: DirectoryItem = filesystem;

	for (let i = 0; i < parts.length; i++) {
		if (parts[i] === "") continue;
		if (typeof obj === "object") obj = obj[parts[i]];
		if (i < parts.length - 1 && typeof obj !== "object") return null;
	}

	return obj;
}

export function tryGetCommandPath(env: envType, command: string) {
	if (command.startsWith("/") || command.startsWith(".") || command.startsWith("~")) {
		return tryParsePath(command);
	}

	const PATHs = env.PATH.split(":");

	for (let i = 0; i < PATHs.length; i++) {
		const obj = getObjAtPath(`${PATHs[i]}/${command}`);
		if (typeof obj === "function") return `${PATHs[i]}/${command}`;
	}

	return null;
}
