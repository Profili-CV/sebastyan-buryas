# Sito di Sebastyan Buryas

## Come metterlo online con GitHub Pages

Il sito sta nell'organizzazione GitHub **Profili-CV**.

1. Su github.com/Profili-CV clicca **New repository**, nome **sebastyan-buryas**, **Public**, poi **Create repository**.
2. Clicca **uploading an existing file** (o **Add file › Upload files**) e trascina tutto il CONTENUTO di questa cartella (index.html, style.css, script.js, il PDF del CV e la cartella img), non la cartella stessa. Poi **Commit changes**.
3. Vai in **Settings › Pages**: Source **Deploy from a branch**, branch **main**, cartella **/ (root)**, **Save**.
4. Dopo un paio di minuti il sito è online su https://profili-cv.github.io/sebastyan-buryas/

Per aggiornarlo in futuro: **Add file › Upload files** e carica i file modificati, con lo stesso nome; sostituiscono i vecchi.

## Come aggiungere le immagini

Ogni riquadro colorato del sito mostra il nome del file che aspetta, per esempio `img/chroma.jpg`.
Salva la tua immagine nella cartella `img` con quel nome esatto e il riquadro viene sostituito dalla foto.

| File | Dove compare |
|---|---|
| img/chroma.jpg | Progetto CHROMA (orizzontale, circa 16:11) |
| img/tesi-triennale.jpg | Tesi triennale (4:3) |
| img/porcodduo.jpg | Porcodduo Studio (4:3) |
| img/zero-robotics.jpg, img/art-for.jpg, img/oriente.jpg | Grafica (verticali, 3:4) |
| img/foto-1.jpg … img/foto-6.jpg | Fotografia (quadrate) |
| img/ritratto.jpg | Chi sono (quadrata) |
| cv-sebastyan-buryas.pdf | Il CV scaricabile, nella cartella principale |

Consiglio: esporta le immagini a 1600 px di lato lungo, in JPG qualità 80, così il sito resta veloce.

## Testi

I testi italiani sono nel file index.html. La traduzione inglese di ogni testo sta nell'attributo `data-en` dello stesso elemento: se cambi una frase, aggiorna anche quella.
