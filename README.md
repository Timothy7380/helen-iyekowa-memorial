# Celebrating Helen Iyekowa (1956–2026)

Memorial website for **Late Deaconess (Mrs.) Helen Aimie-Ikpomoyako Iyekowa (Née Igbinosun)**,
10 October 1956 – 11 September 2026.

The site includes her biography, the order of events (Service of Songs, Interment, Reception),
the burial programme PDF, tributes, tribute films and short clips, two tribute songs and a photo slideshow.

## Structure

```
index.html              Page markup
css/style.css           All styles (responsive from 320px phones to large desktops)
js/main.js              Slideshow, tribute slider, films player, tribute song player
img/                    Photos, programme cover, favicon and share image
media/                  Tribute films, short clips, video posters and tribute songs
docs/burial-programme.pdf
```

It is a static site with no build step. Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Editing

- **Events, biography, tributes:** edit the text in `index.html`.
- **Photos in the slideshow:** add the image to `img/` and add a line to the `P` list in `js/main.js`.
- **Videos:** add the file and a poster image to `media/` and add a line to `FILMS` or `CLIPS` in `js/main.js`.
- **Songs:** add the mp3 to `media/` and add it to `SONGS` in `js/main.js`.

## Hosting

Hosted with GitHub Pages from the `main` branch root: https://timothy7380.github.io/helen-iyekowa-memorial/
