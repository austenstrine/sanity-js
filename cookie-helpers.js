
function setCookie(name, value, expirationDays) {
	const date = new Date();
	date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000)); // Set expiration time in milliseconds
	const expires = "expires=" + date.toUTCString();
	const cookieval = name + "=" + value + ";" + expires + ";path=/";
	document.cookie = cookieval;
}

function getCookie(name) {
	const cookieString = decodeURIComponent(document.cookie);
	const cookies = cookieString.split('; ');

	for(let i = 0; i < cookies.length; i++) {
		const cookiePair = cookies[i].split('=');
		const cookieName = cookiePair[0];
		const cookieValue = cookiePair[1];

		if(cookieName === name) {
			return cookieValue;
		}
	}

	return null; // Return null if the cookie with the given name is not found
}