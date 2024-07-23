import {
	envVars,
	filesystem,
	getCurrentDir,
	setCurrentDir,
	type Directory,
	type DirectoryItem,
} from "./data";

import { printTermLine, printRawHTML, printImage, terminal } from "./terminal";

const fetchInfoCopy = document.getElementById("fetch-row")!.cloneNode(true);

function tryParsePath(path: string | undefined) {
	if (!path) path = getCurrentDir();
	if (!path.startsWith("/")) path = `${getCurrentDir()}/${path}`;

	// replace /abc/def/.. with /abc
	path = path.replace(/\/[^/]+\/\.\./g, "");

	// replace /abc/./def with /abc/def
	path = path.replace(/\/\.\//g, "/");

	// replace /+ with /
	path = path.replace(/\/+/g, "/");

	return path;
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

async function which(command: string) {
	const path = tryGetCommandPath(command);

	if (!path) {
		printTermLine(`which: ${command}: command not found`);
		return 1;
	}

	printTermLine(path);
	return 0;
}

export function tryGetCommandPath(command: string) {
	const PATHs = envVars.PATH.split(":");

	for (let i = 0; i < PATHs.length; i++) {
		const obj = getObjAtPath(`${PATHs[i]}/${command}`);
		if (typeof obj === "function") return `${PATHs[i]}/${command}`;
	}

	return null;
}

async function ls(path: string | undefined) {
	path = tryParsePath(path);
	const obj = getObjAtPath(path) as Directory;

	const dirs = Object.keys(obj).filter((key) => typeof obj[key] === "object");
	const files = Object.keys(obj).filter((key) => typeof obj[key] !== "object");

	let contents = "";
	if (dirs.length > 0) contents += dirs.join("/ ") + "/ ";
	contents += files.join(" ");

	printTermLine(contents);

	return 0;
}

async function echo(...args: string[]) {
	let text = args.join(" ");
	// Replace environment variables
	text = text.replace(/\$([A-Z_]+)/g, (_, key) => envVars[key] || "");
	printTermLine(text);
	return 0;
}

async function env() {
	let vars = "";
	for (const [key, value] of Object.entries(envVars)) {
		vars += `${key}=${value}\n`;
	}
	printTermLine(vars);
	return 0;
}

async function cat(file: string) {
	const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
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
		printTermLine(obj.toString());
	} else if (typeof obj === "string") {
		const extenstion = file.split(".")?.pop()!;

		if (imageExtensions.includes(extenstion)) {
			printImage(obj);
		} else {
			printTermLine(obj);
		}
	} else {
		printTermLine("File type not supported!");
	}

	return 0;
}

async function cd(path: string) {
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

async function pwd() {
	printTermLine(getCurrentDir());
	return 0;
}

async function clear() {
	terminal.innerHTML = "";
	return 0;
}

async function ping(address: string) {
	printTermLine(`PING ${address} 56 data bytes`);
	let failed = false;

	for (let i = 0; i < 5; i++) {
		if (failed) return 1;

		const start = performance.now();
		await fetch(`https://${address}`, { mode: "no-cors" })
			.then(() => {
				const end = performance.now();
				printTermLine(
					`64 bytes from ${address}: icmp_seq=${i + 1} time=${end - start} ms`
				);
			})
			.catch((e) => {
				console.error(e);
				printTermLine(`ping: ${address}: Address not reachable`);
				failed = true;
			});

		if (!failed) await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	return 0;
}

async function steam() {
	const url = "https://steamcommunity.com/id/_weird_autumn_";
	window.location.href = `steam://openurl/${url}`;
	printTermLine(`Opening <a href="${url}" target="_blank">Steam profile</a>`);
	return 0;
}

async function tree(path: string | undefined) {
	path = tryParsePath(path);

	printTermLine(`.${await treeDir(path)}`);

	return 0;
}

async function treeDir(path: string) {
	path = tryParsePath(path);
	const obj = getObjAtPath(path);
	if (!obj || typeof obj !== "object") return "";

	const items = Object.keys(obj);

	let tree = "";
	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const isLast = i === items.length - 1;
		const connector = isLast ? "└──" : "├──";
		tree += `\n${connector} ${item}`;

		if (typeof obj[item] === "object" && Object.keys(obj[item]).length > 0) {
			const newPath = `${path}/${item}`;
			const isLastDir = i === items.length - 1;
			const indented = await indentTree(await treeDir(newPath), isLastDir);
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

async function help() {
	let helpText = "Available commands:\n";
	for (const [command, { desc }] of Object.entries(commands)) {
		helpText += `${command} - ${desc}\n`;
	}

	printTermLine(helpText);

	return 0;
}

async function whoAmI() {
	terminal.appendChild(fetchInfoCopy.cloneNode(true));
	return 0;
}

async function fetchMusic() {
	printRawHTML(
		`<music-display
			nowPlayingApi="https://music-display.mck.is/now-playing"
			websocketUrl="wss://music-display.mck.is/now-playing-ws">
		</music-display>`
	);

	return 0;
}

export const commands = {
	ls: { fn: ls, desc: "list available directories" },
	echo: { fn: echo, desc: "print text" },
	cat: { fn: cat, desc: "print file contents" },
	cd: { fn: cd, desc: "change directory" },
	pwd: { fn: pwd, desc: "print working directory" },
	help: { fn: help, desc: "display this message" },
	clear: { fn: clear, desc: "clear the terminal" },
	ping: { fn: ping, desc: "ping a server" },
	whoami: { fn: whoAmI, desc: "about me" },
	steam: { fn: steam, desc: "steam" },
	tree: { fn: tree, desc: "list directory tree" },
	env: { fn: env, desc: "print environment variables" },
	which: { fn: which, desc: "locate a command" },
	"fetch-music": { fn: fetchMusic, desc: "what I'm listening to" },
} as Record<
	string,
	{ fn: (...args: string[]) => Promise<number>; desc: string }
>;

export {
	ls,
	echo,
	cat,
	cd,
	pwd,
	help,
	clear,
	ping,
	whoAmI,
	steam,
	tree,
	env,
	fetchMusic,
	which,
};
