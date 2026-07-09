const baseHTML = /*html*/ `
<div id="titleBar">
	<div id="titlebarLeft">
		<img src="" alt="Window Icon" id="windowIcon" />
	</div>
	<div id="titlebarCenter">
		<span id="titlebarText"></span>
	</div>
	<div id="titlebarRight">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="var(--closeCircle)"
			stroke="var(--closeX)"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			id="closeBtn">
			<circle cx="12" cy="12" r="12" stroke-width="0"></circle>
			<line x1="18" y1="6" x2="6" y2="18"></line>
			<line x1="6" y1="6" x2="18" y2="18"></line>
		</svg>
		<div id="minimizeButton"></div>
		<div id="maximizeButton"></div>
	</div>
</div>
<div id="windowContent"></div>
`;

const style = /*css*/ `

:host {
	border: 2px solid var(--base-below-below);
	border-radius: 0.5rem;
	transition: border 1s cubic-bezier(0.075, 0.82, 0.165, 1);
	overflow: hidden;

	min-width: 2rem;
	min-height: 2rem;

	width: 20rem;
	height: 20rem;
	
	position: absolute;
	top: 0;
	left: 0;
}

:host(:hover) {
	border: 2px solid var(--accent);
}

#titleBar {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	background: var(--base-below-below);

	#windowIcon {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* when the window has an empty src, hide */
	#windowIcon[src=""] {
		display: none;
	}

	#titlebarText,
	#windowIcon {
		pointer-events: none;
		user-select: none;
	}

	#closeBtn {
		width: 1.25rem;
		height: 1.25rem;
		cursor: pointer;

		transition: all 0.3s ease;

		--closeCircle: transparent;
		--closeX: var(--text);

		&:hover {
			--closeCircle: #ed8796;
			--closeX: var(--base-below-below);
		}
	}

	#titlebarLeft,
	#titlebarCenter,
	#titlebarRight {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
}

#windowContent {
	width: 100%;
	height: 100%;
}
`;

export class X12Window extends HTMLElement {
	windowTitle: string = "";
	windowIcon: string = "";

	constructor() {
		super();
		let shadow = this.attachShadow({ mode: "closed" });
		shadow.innerHTML = baseHTML;

		const stylesheet = new CSSStyleSheet();
		stylesheet.replaceSync(style);
		shadow.adoptedStyleSheets = [stylesheet];

		// add mouseDown event listener to titleBar
		const titleBar = shadow.getElementById("titleBar")!;
		titleBar.addEventListener("mousedown", createMouseDownHandler(this));

		// add close button event listener
		const closeBtn = shadow.getElementById("closeBtn")!;
		closeBtn.addEventListener("click", createCloseWindowHandler(this));
	}
}

function createCloseWindowHandler(window: X12Window) {
	return () => {
		window.remove();
	};
}

function createMouseDownHandler(window: X12Window) {
	return (e: MouseEvent) => {
		const windowStart = {
			x: window.offsetLeft,
			y: window.offsetTop,
		};

		const mouseStart = {
			x: e.clientX,
			y: e.clientY,
		};

		moveWindow(window, mouseStart, windowStart);
	};
}

function moveWindow(window: X12Window, mouseStart: position, windowStart: position) {
	const onMouseMove = (e: MouseEvent) => {
		const x = windowStart.x + e.clientX - mouseStart.x;
		const y = windowStart.y + e.clientY - mouseStart.y;
		window.style.left = x + "px";
		window.style.top = y + "px";

		e.preventDefault();
	};

	const onMouseUp = () => {
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	};

	document.addEventListener("mousemove", onMouseMove);

	document.addEventListener("mouseup", onMouseUp);
}

type position = {
	x: number;
	y: number;
};

customElements.define("x12-window", X12Window);
