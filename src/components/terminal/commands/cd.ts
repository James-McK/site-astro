import { type envType, setCurrentDir } from "../data";
import { printTermLine } from "../terminal";
import { tryParsePath, getObjAtPath } from "./jsh";

export default async function cd(_env: envType, path: string) {
	// special case for cd with no arguments, go to home
	if (!path) path = "/home/autumn";

	path = tryParsePath(path);

	const obj = getObjAtPath(path);

	if (!obj) {
		printTermLine(`cd: The directory ${path} does not exist`);
		return 1;
	}

	if (typeof obj !== "object") {
		printTermLine(`cd: ${path} is not a directory`);
		return 1;
	}

	setCurrentDir(path);

	const magicDirs = {
		"/home/autumn/projects": "/projects",
		"/home/autumn/blog": "/blog",
		"/home/autumn/uses": "/uses",
	} as Record<string, string>;

	if (magicDirs[path]) window.location.href = magicDirs[path];

	return 0;
}
