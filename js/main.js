let moviesStore = [
    {
        title: "Pulp Fiction",
        description:
            "Dos asesinos, un boxeador, un gangster y su esposa, y un par de bandidos se entrecruzan en cuatro historias de violencia y redención.",
        year: 1994,
    },
    {
        title: "Sueños de Libertad",
        description:
            "La historia de un banquero encarcelado por un crimen que no cometió y su amistad a lo largo de los años con otro convicto que ayuda a su vida.",
        year: 1994,
    },
    {
        title: "El Padrino",
        description:
            "La saga de la familia criminal de los Corleone, dirigida por el patriarca Vito Corleone y luego por su hijo Michael.",
        year: 1972,
    },
    {
        title: "Origen",
        description:
            "Un ladrón que roba secretos corporativos a través del uso de la tecnología de compartir sueños se enfrenta a la tarea inversa de plantar una idea en la mente de un CEO.",
        year: 2010,
    },
    {
        title: "Interestelar",
        description:
            "Un grupo de exploradores espaciales se embarca en un viaje a través de un agujero de gusano en busca de un nuevo hogar para la humanidad después de que la Tierra se vuelva inhabitable.",
        year: 2014,
    },
    {
        title: "El Caballero de la Noche",
        description:
            "Batman se enfrenta al Joker, un criminal despiadado que busca sumir a Gotham City en el caos.",
        year: 2008,
    },
    {
        title: "Matrix",
        description:
            "Un programador descubre la verdad sobre su realidad y su papel en la guerra contra las máquinas que han esclavizado a la humanidad.",
        year: 1999,
    },
];

const goBack = () => history.back();

const goForward = () => history.forward();

const mainElem = document.querySelector("main");
if (!localStorage.getItem("movies")) {
    localStorage.setItem("movies", JSON.stringify(moviesStore));
}

document.addEventListener("DOMContentLoaded", () => {
    onLoadTemplate(location.hash.slice(1) || "home");
    attachFormSubmitEvent();
});

window.addEventListener("popstate", () => {
    const parsedHash = location.hash.slice(1);
    onLoadTemplate(parsedHash || "home");
});

const onLoadTemplate = (template) => {
    if (template !== "home") {
        location.hash = template;
    } else {
        location.hash = "";
    }
    const xhr = new XMLHttpRequest();
    xhr.open("get", `../pages/${template}.html`);
    xhr.addEventListener("load", () => {
        mainElem.innerHTML = xhr.response;
        if (template === "home") {
            setTimeout(loadMovies, 0);
        } else if (template === "addFilm") {
            attachFormSubmitEvent();
        }
    });
    xhr.send();
};

const containerFilm = (title, year, description) => {
    return `
    <div class="film__item">
      <h3 class="film__name">${title}</h3>
      <p class="film__year">Año de lanzamiento: ${year}</p>
      <p class="film__description">${description}</p>
    </div>`;
};

const loadMovies = () => {
    let movies = JSON.parse(localStorage.getItem("movies")) || [];
    let allContainerFilms = movies
        .map((movie) =>
            containerFilm(movie.title, movie.year, movie.description)
        )
        .join("");

    const filmContainer = document.getElementById("filmContainer");
    if (filmContainer) {
        filmContainer.innerHTML = allContainerFilms;
    }
    initializeSearch();
};

document.addEventListener("DOMContentLoaded", () => {
    onLoadTemplate(location.hash.slice(1) || "home");
});

const attachFormSubmitEvent = () => {
    const addFilmForm = document.getElementById("addFilmForm");
    if (addFilmForm) {
        addFilmForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const titleInput = document.getElementById("titleFilm");
            const yearInput = document.getElementById("yearFilm");
            const descriptionInput = document.getElementById("descriptionFilm");

            const title = titleInput.value;
            const year = parseInt(yearInput.value);
            const description = descriptionInput.value;

            let movies = JSON.parse(localStorage.getItem("movies")) || [];
            movies.push({ title, year, description });
            localStorage.setItem("movies", JSON.stringify(movies));
            onLoadTemplate("home");
        });
    }
};

const initializeSearch = () => {
    const searchInput = document.querySelector(".search__input");
    const yearFilterInput = document.getElementById("yearFilter");

    searchInput.addEventListener("input", filterMovies);
    yearFilterInput.addEventListener("input", filterMovies);
};

const filterMovies = () => {
    const searchInput = document.querySelector(".search__input");
    const yearFilterInput = document.getElementById("yearFilter");
    const searchTerm = searchInput.value.toLowerCase();
    const yearFilter = yearFilterInput.value.trim();

    const filmItems = document.querySelectorAll(".film__item");
    let foundMovies = false;
    let moviesNotFound = true;

    if (searchTerm === "" && yearFilter === "") {
        loadMovies();
        return;
    }

    filmItems.forEach((item) => {
        const title = item
            .querySelector(".film__name")
            .textContent.toLowerCase();
        const year = parseInt(
            item.querySelector(".film__year").textContent.match(/\d+/)[0]
        );

        const titleMatch = title.includes(searchTerm);
        const yearMatch =
            yearFilter === "" || year.toString().startsWith(yearFilter);

        if (titleMatch && yearMatch) {
            item.style.display = "";
            foundMovies = true;
            moviesNotFound = false;
        } else {
            item.style.display = "none";
        }
    });

    if (!foundMovies && moviesNotFound) {
        const filmContainer = document.getElementById("filmContainer");
        filmContainer.innerHTML = `
        <section class="error__section">
            <div class="error__container">
                <i class="fa-regular fa-face-sad-cry"></i>

                <p class="error__title">Película no encontrada</p>
            </div>
        </section>
        `;
    }
};
