# DJ Arwenn – galerija 23 fotografij

Ta veja doda novo galerijo na mesto obstoječega »Utrinki kmalu« v razdelku `#utrinki`.

**Pomembno:** Galerija se vključi šele, ko je dosegljiva prva fotografija
`assets/gallery/01-thumb.webp`. Do takrat obiskovalci vidijo obstoječo
sekcijo, brez manjkajočih slik. Datumov rezervacij, forme in API-jev ne spreminjamo.

## Vsebina
- 23 odobrenih različic (vključno z obema fotografijama izpod šotora).
- 23 velikih slik: `assets/gallery/01.webp` ... `23.webp`
- 23 predogledov: `assets/gallery/01-thumb.webp` ... `23-thumb.webp`
- Kategorije: Nastopi, Portreti, Utrinki.
- Dvojezična galerija, povečevanje posamezne fotografije, puščice, ESC, lazy loading.

## Zahtevani medijski fajli

Iz paketa `DJ_Arwenn_GALERIJA_23_za_splet_2026-11-05.zip`
se v repozitorij na **to vejo** prenese samo vsebina mape
`DJ_Arwenn_spletna_galerija/assets/gallery/` (vseh 46 datotek),
v GitHub mapo `assets/gallery/`.

GitHub ne zna uporabiti ZIP arhiva kot slike: vsaka datoteka mora biti
v repozitoriju ločeno. Fotografij ne kopirajte iz prvotnega 34 MB
arhivskega ZIP, ker so te velikosti neprimerne za splet.

## Po nalaganju
1. Preveriti obstoj `assets/gallery/01-thumb.webp` do `23-thumb.webp`.
2. Lokalno ali na Cloudflare Pages preview preizkusiti mobilni prikaz
   360/390/430px, tab filtrov, povečavo in preklop SI/EN.
3. Šele nato združiti PR v `main`.
4. Na živi strani odpreti `https://djarwenn.pages.dev/#utrinki`.

Obstoječa sekcija s povezavami na Facebook, Instagram in Linktree ostane.
