import { getObjAtPath, tryGetCommandPath } from "./commands/jsh";
import { envVars, getCurrentDir } from "./data";

export const terminal = document.getElementById("terminalContent")!;

export function printTermLine(text: string) {
	const pre = document.createElement("pre");
	pre.textContent = text;
	terminal.appendChild(pre);
	terminal.scrollTop = terminal.scrollHeight;
}

/**
 * only use this one if you're sure
 */
export function printRawHTML(html: string) {
	const div = document.createElement("div");
	div.innerHTML = html;
	terminal.appendChild(div);
}

export function printImage(src: string) {
	const img = document.createElement("img");
	img.src = src;
	img.style.maxWidth = "16rem";
	terminal.appendChild(img);
}

function getPrompt() {
	return `[${envVars.USER}@${envVars.hostname} ${getDirForPrompt()}]$`;
}

function getDirForPrompt() {
	if (getCurrentDir() === "/home/autumn") return "~";
	if (getCurrentDir() === "/") return "/";

	const parts = getCurrentDir().split("/");
	return parts[parts.length - 1];
}

function getWindowTitle() {
	return `${envVars.USER}@${envVars.hostname}:${getDirForTitle()}`;
}

function getDirForTitle() {
	let currentDir = getCurrentDir();
	if (currentDir.startsWith("/home/autumn")) currentDir = currentDir.replace("/home/autumn", "~");
	if (currentDir === "/") return "/";

	return currentDir;
}

async function tryRunCommand(command: string) {
	command = command.replace(/\$([a-zA-Z_?]+)/g, (_, key) => envVars[key] || "");
	const [cmdEnvVars, cmd, ...args] = parseCommand(command);

	const commandEnvVars = {
		...envVars,
		...(cmdEnvVars as Record<string, string>),
	};

	const path = tryGetCommandPath(commandEnvVars, cmd as string);

	if (!path) {
		printTermLine(`bash: ${cmd}: command not found.\nRun 'help' for a list of available commands.`);

		return 127;
	}

	const obj = getObjAtPath(path);
	if (typeof obj === "function") {
		return await obj(commandEnvVars, ...(args as string[]));
	} else if (typeof obj === "string") {
		await runScript(obj);
		return 0;
	}

	return 1; // should never reach here
}

function parseCommand(command: string) {
	// parse out env vars being set at the start (eg. VAR=value TEST=123 command arg1 arg2)
	const envVars = {} as Record<string, string>;
	const parts = command.split(" "); // todo handle quotes

	for (let i = 0; i < parts.length; i++) {
		const [key, value] = parts[i].split("=");
		if (key && value) {
			envVars[key] = value;
		} else {
			break;
		}
	}

	const cmd = parts[Object.keys(envVars).length];
	const args = parts.slice(Object.keys(envVars).length + 1);

	return [envVars, cmd, ...args];
}

async function parseLine(line: string) {
	if (line.trim() === "") return;
	let commands = line.split("&&");

	for (let i = 0; i < commands.length; i++) {
		let result = await tryRunCommand(commands[i].trim());
		envVars["?"] = result.toString();
		if (result !== 0) return;
	}
}

export async function onEnterKey(command: string) {
	const typed = document.getElementById("typed")!;
	const caret = document.getElementById("caret")!;
	const input = document.getElementById("input")!;
	const prompt = document.getElementById("prompt")!;
	const windowTitle = document.getElementById("titlebarText")!;
	input.style.display = "none";

	printTermLine(`${getPrompt()} ${command}`);

	if (command.trim() !== "") {
		await parseLine(command);
	}

	prompt.innerText = getPrompt();
	windowTitle.innerText = getWindowTitle();
	const terminal = document.getElementById("terminalContent")!;
	terminal.scrollTop = terminal.scrollHeight;

	typed.textContent = "";
	caret.style.opacity = "1";
	input.style.display = "block";
}

async function runScript(script: string) {
	const lines = script.split("\n");

	for (let i = 0; i < lines.length; i++) {
		await parseLine(lines[i]);
	}
}
