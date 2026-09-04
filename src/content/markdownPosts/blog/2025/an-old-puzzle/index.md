---
title: Decoding a 20-Year-Old Puzzle
description: Deobfuscating and deciphering
published: 2025-07-31
previewImage: ./preview.avif
---

Yesterday I was at a workshop on [web penetration testing](https://indico.cern.ch/event/1560038/attachments/3088048/5517717/2025%20web%20pentesting%20-%20summer%20student%20workshop.pdf) for CERN summer students; although I'd covered most of the content myself previously, the exercises were a lot of fun to work through! The extra puzzle at the end especially hooked me:

> "This is not a real exercise for finding security bugs, but rather a puzzle for those who finished other exercises and want to have a more difficult challenge.
>
> Open [secret.html](./secret.html). As you see, it is a single HTML file with some JavaScript embedded. There is a secret message that will only be revealed when you provide a correct password. Find the password! It should be simple - how could a static HTML page possibly hide something, right?
>
> (I found this puzzle public on the Web - I don't know who's the author, so I can't credit them. The steps to solve the puzzle proposed in part Hint and Solution are mine - there could be other ways to solve it.)"

![Screenshot of a page containing a text box asking for a password to be entered, with a button labeled "Go!"](page.avif)

## Stop!

I heavily recommend you attempt to get the password yourself before reading any further. You'll have more fun and learn more that way! You have been warned.

<details>
	<summary>Hint 1</summary>
	What javascript has been run? What does it produce?
</details>

<details>
	<summary>Hint 2</summary>
	If you assume the password only contains ASCII characters, what length must it be?
</details>

## Solving the puzzle

```html
<!--hppage status="protected"-->
<html>
	<script language="JavaScript">
		document.write(unescape("%3C%53%43..."));
		hp_d01(unescape(">#//JGCF/..."));
		hp_d01(unescape(">#//@MF[/..."));
	</script>
</html>
```

<center>

_Note: The code is modified to be slightly more readable_

</center>

Viewing the source, there's already a couple of noticeable things:

- There's almost no actual HTML to the page, essentially only a html tag and a script tag - no input field asking for the password
- A function not seemingly defined anywhere (`hp_d01`) is being called
- The script tags have a `LANGUAGE="JavaScript"` attribute, deprecated in HTML 4.01 in 1999
- All the javascript is obfuscated

Interestingly, none of the "javascript deobfuscators" that I found online seem to have any idea what to do with it. Good news for us - that means we have the fun of figuring it out for ourselves!

While we could use "Inspect" to view the state of the DOM after the javascript has run, it's possible it could rewrite the DOM multiple times to hide something from it, so to make sure we should decode it ourselves. Running `console.log(unescape("%3C%53%43..."))` we get:

```html
<script language="JavaScript">
	hp_ok = true;
	function hp_d01(s) {
		if (!hp_ok) return;
		var o = "",
			ar = new Array(),
			os = "",
			ic = 0;
		for (i = 0; i < s.length; i++) {
			c = s.charCodeAt(i);
			if (c < 128) c = c ^ 2;
			os += String.fromCharCode(c);
			if (os.length > 80) {
				ar[ic++] = os;
				os = "";
			}
		}
		o = ar.join("") + os;
		document.write(o);
	}
</script>
```

Our missing undefined function! It seems to be decoding ascii characters in the input string `s` by xor-ing them with 2. The chunking it does appears to do nothing, so tidying it up, renaming some variables, and modifying it to print the output instead of writing it to the DOM:

```js
let hp_ok = true;

function hp_d01(string) {
	if (!hp_ok) return;

	let output = "";
	for (let index = 0; index < string.length; index++) {
		let charCode = string.charCodeAt(index);
		if (charCode < 128) charCode = charCode ^ 2;
		output += String.fromCharCode(charCode);
	}

	console.log(output);
}
```

Running the rest of the obfuscated javascript through `unescape` and `hp_d01`, we finally get the HTML being rendered by the browser, along with two functions for us to look at:

```html
<script language="JavaScript">
	function Kod(s, pass) {
		// ...
	}

	function f(form) {
		// ...
	}
</script>

<center>
	<form name="form" method="post" action="">
		<b>Enter password:</b>
		<input type="password" name="pass" size="30" maxlength="30" value="" />
		<input type="button" value=" Go! " onClick="f(this.form)" />
	</form>
</center>

<table width="100%" border="0">
	<tr bgcolor="#445577" align="center">
		<td>
			<font face="Arial, Helvetica, sans-serif" color="#FFFFFF" size="-1">
				This webpage was protected by HTMLProtector
			</font>
		</td>
	</tr>
</table>
```

The `Kod` function seems to be what decodes the secret message; an XOR cipher. For now, it doesn't give us much to work with.

```js
function Kod(s, pass) {
	var i = 0;
	var BlaBla = "";
	for (j = 0; j < s.length; j++) {
		BlaBla += String.fromCharCode(pass.charCodeAt(i++) ^ s.charCodeAt(j));
		if (i >= pass.length) i = 0;
	}
	return BlaBla;
}
```

The `f` function looks much more interesting though, and is the one actually called by the form being submitted:

```js
function f(form) {
	var pass = document.form.pass.value;
	var hash = 0;
	for (j = 0; j < pass.length; j++) {
		var n = pass.charCodeAt(j);
		hash += (n - j + 33) ^ 31025;
	}

	if (hash == 124313) {
		var Secret = "" + "\x68\x56\x42\..." + "";
		var s = Kod(Secret, pass);
		document.write(s);
	} else {
		alert("Wrong password!");
	}
}
```

This contains both the secret message, and some sort of "hash". Although we won't be able to figure out the password from this alone, it still gives us some useful information. Assuming the password only contains ASCII characters, each character will be a max value of 127, so when xor-ing with 31025:

```txt
    0111 1001 0011 0001
xor 0000 0000 0??? ????
```

The most significant digits will remain unchanged. Given that for each character the result is just added to the sum so far, `124313 / 31025 = 4.006...` - the password must only be 4 characters long. Unfortunately, assuming the password could be made out of any combination of printable ascii characters, we're still left with `95 ** 4 = 81,450,625` possible passwords!

There's two options I can think of from here:

- Use frequency analysis to find the most likely password(s)
- Brute force checking passwords to see which ones create a printable ascii output from the secret message

In this case I decided to go with brute force - It seemed like the simplest approach, and 81 million passwords really isn't that many to check with how fast computers are.

First, we can get a list of all passwords that pass the "hash" check:

```ts
const charSet: string[] = [];
for (let index = 32; index < 127; index++) {
	charSet.push(String.fromCharCode(index));
}
console.log("Working with char set: ", charSet.join(""));

const passwords: string[] = [];
function generatePasswords(generateChar: number = 0, soFar: string = "") {
	for (let index = 0; index < charSet.length; index++) {
		const current = soFar + charSet[index];

		if (generateChar < 3) {
			generatePasswords(generateChar + 1, current);
		} else if (checkHash(current)) {
			passwords.push(current);
		}
	}
}

generatePasswords();
console.log("Generated", passwords.length, "passwords passing the 'hash' check");
```

Only around 0.3% of passwords pass this check, but that still leaves us with 263,137 passwords to check! A few too many to do manually, but making some assumptions about what characters are unlikely to be in the decoded output, we can narrow it down to a single option:

```ts
function isPrintableASCII(str: string) {
	return /^[\x20-\x7F]*$/.test(str);
}

for (let password of passwords) {
	const decoded = attemptDecode(password);
	if (!isPrintableASCII(decoded)) continue;
	if (/[+@#`$]/.test(decoded)) continue;

	console.log("Found possibly valid password", password);
	console.log("Decoded:", decoded);
}
```

Checking all these passwords took less than 5 seconds, and is enough to get the secret message! With the assumptions made to get here, it's possible this approach wouldn't have worked, but I got lucky. If you want the message and password, this has given you everything to decode it! That bit's up to you :D
