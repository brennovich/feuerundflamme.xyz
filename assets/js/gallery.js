document.addEventListener("DOMContentLoaded", () => {
	Gallery.setup();
});

const Gallery = {
	element: ".gallery",
	setup() {
		const backdrop = document.createElement("figure");
		backdrop.classList.add("backdrop");

		document.querySelector("body").appendChild(backdrop);
		backdrop.addEventListener("click", this.hide, false);

		const items = document.querySelectorAll(this.element + " li");
		items.forEach((item) => {
			const link = document.createElement("a");
			const img = item.firstChild;

			link.setAttribute("href", img.getAttribute("src"));
			link.appendChild(img)
			item.appendChild(link);

			link.addEventListener("click", this.view, false);
		})
	},
	view(ev) {
		ev.preventDefault();

		const backdrop = document.querySelector(".backdrop");
		const img = ev.currentTarget.firstChild;

		if (img.classList.contains("focus")) {
			Gallery.hide()
			return;
		}

		img.classList.toggle("focus");
		backdrop.classList.toggle("focus");

		img.style.left = ((window.innerWidth - img.width) / 2) + "px";
	},
	hide() {
		const backdrop = document.querySelector(".backdrop");
		const img = document.querySelector("img.focus");

		img.classList.toggle("focus");
		backdrop.classList.toggle("focus");

		img.style.left = "0px";
	}
}
