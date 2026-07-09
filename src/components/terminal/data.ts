import {
	ls,
	cd,
	cat,
	echo,
	pwd,
	help,
	clear,
	ping,
	whoAmI,
	tree,
	env,
	which,
	fetchMusic,
} from "./commands";

export type envType = Record<string, string>;

export const user = document.getElementById("terminal")!.dataset.user;

let currentDir = "/home/autumn";
export function setCurrentDir(dir: string) {
	currentDir = dir;
}
export function getCurrentDir() {
	return currentDir;
}

export const envVars = {
	PATH: "/usr/bin:/bin",
	USER: user?.split("@")[0] ?? "autumn",
	HOME: "/home/autumn",
	hostname: user?.split("@")[1] ?? "mck",
	SHELL: "/bin/bash",
	LANG: "en_GB.UTF-8",
	DISPLAY: ":0",
	TERM: `xterm-${navigator.userAgent.includes("Firefox") ? "firefox" : "chromium"}`,
	"?": "0",
} as Record<string, string>;

export const filesystem = {
	home: {
		autumn: {
			".secret.txt": "you found a secret!",
			"me.avif": (document.getElementById("img")! as HTMLImageElement).src,
			projects: {},
			blog: {},
			uses: {},
			"startup.sh": `
echo [$USER@$hostname ~]$ whoami
whoami
echo [$USER@$hostname ~]$ fetch-music
fetch-music`,
		},
	},
	bin: {
		ls: ls,
		cd: cd,
		cat: cat,
	},
	usr: {
		bin: {
			echo: echo,
			pwd: pwd,
			help: help,
			clear: clear,
			ping: ping,
			whoami: whoAmI,
			tree: tree,
			env: env,
			which: which,
			"fetch-music": fetchMusic,
		},
	},
} as Directory;

export type Directory = {
	[key: string]: DirectoryItem;
};

export type DirectoryItem =
	| Directory
	| string
	| ((env: envType, ...args: string[]) => Promise<number>);
