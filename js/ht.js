//		JWT 2018
//		Matti Luiro

let kentta;
let pelaajanNimi = "Nimetön";
let pelaajanPisteet;
let aika;
let tulos;
let ennatys;
let ennatysTekija;
let uusiKentta = 1;
let kentanKoko = 3;
let kenttaRivi;


window.addEventListener('keydown', showKeyDown);

// Tarkistaa mitä näppäintä on painettu ja jos nuolinäppäimiä, niin liikuttaa pelaajaa.
function showKeyDown(e) {
	switch(e.key){
		case "ArrowUp":
			liiku("up");
			break;
		case "ArrowDown":
			liiku("down");
			break;
		case "ArrowLeft":
			liiku("left");
			break;
		case "ArrowRight":
			liiku("right");
			break;
		default:
			break;
	}
}

// Alustaa pelin ladattaessa sivua.
window.onload=function(){
	alusta();
}

// Tätä kutsutaan, jos pelaaja haluaa vaihtaa kentän kokoa.
function alustaKentta() {
	uusiKentta = 1;
	alusta();
}

// Alustusmetodi, joka tekee hieman erilaisen alustuksen sivua ladattaessa ensimmäistä kertaa
// ja pelaajan halutessa vaihtaa kentän kokoa.
function alusta() {
	if(uusiKentta == 1){
		kentanKoko = prompt("Anna kentän koko (3, 4 tai 6)", kentanKoko);
		if(isNaN(kentanKoko) || kentanKoko < 3 || kentanKoko > 6 || kentanKoko == 5){
			alert("Virhe: Kentän koko virheellinen!");
			kentanKoko = 3;
		}
		if(lataaKeksi("kKoko") != kentanKoko){
			asetaKeksi("ennatys", null, 30);
			asetaKeksi("tekija", null, 30);
			asetaKeksi("kKoko", null, 30);
			ennatys = null;
			ennatysTekija = null;
			tulos = null;
			aika = null;
			pelaajanPisteet = null;			
		}
		uusiKentta = 0;		
	}
	// Kentän arvona: 0 = tyhjä, 1 = pelaaja, 2 = dollari, 3 = super dollari
	kentta  = [];
	for(let i = 0; i < kentanKoko; i++){
		kenttaRivi = [];
		for(let j = 0; j < kentanKoko; j++){
			kenttaRivi.push(0);
		}
		kentta.push(kenttaRivi);
	}
	kentta[0][0] = 2;
	kentta[kentanKoko-1][0] = 3;
	kentta[0][kentanKoko-1] = 2;
	kentta[kentanKoko-1][kentanKoko-1] = 2;
	kentta[Math.floor(kentanKoko/2)][Math.floor(kentanKoko/2)] = 1;
	pelaajanPisteet =  0;
	let nimi;
	if(pelaajanNimi != "Nimetön"){
		nimi = prompt("Anna pelaajanimesi", pelaajanNimi);
	}
	else{
		nimi = prompt("Anna pelaajanimesi", "");
	}
	if (nimi != null && nimi.length > 1 && nimi.length <= 35) {
	 pelaajanNimi = nimi;
    document.getElementById("nimi").innerHTML = nimi;
	} 
	else {
		alert("Virhe: Antamasi nimi on virheellinen.");
		pelaajanNimi = "Nimetön";
	}
	document.getElementById("pisteet").innerHTML = "$" + pelaajanPisteet;
	sekoita();
	tarkistaKeksi();
	tulostaEnnatys();
	aika = new Date();
	kaynnistaAjastin() ;
	piirra();
	tarkista();
}

// Sekoittaa kentän objektien paikkaa. Jos sekoitettavissa ruuduissa on pelaaja, niin sekoitusta ei tapahdu.
function sekoita(){
    for (let i = kentta.length - 1; i > 0; i--) {
		 for(let j = kentta[i].length - 1; j > 0; j--){
			 if(kentta[i][j] != 1) {
				 let i2 = Math.floor(Math.random() * ((kentta.length - 1) + 1));
				 let j2 = Math.floor(Math.random() * ((kentta[i].length - 1) + 1));
				 if(kentta[i2][j2] != 1){
					 let temp = kentta[i][j];
					 kentta[i][j] = kentta[i2][j2];
					 kentta[i2][j2] = temp;
				 }
			 }
		 }
    }	
}

// Mikäli pelaaja haluaa vaihtaa nimeään, niin tätä kutsutaan. 
// Mukana on tarkistus, ettei liian lyhyttä, pitkää tai tyhjää merkkijonoa hyväksytä.
function vaihdaNimi() {
	let nimi = prompt("Vaihda pelaajanimesi", pelaajanNimi);
	if (nimi != null && nimi.length > 1 && nimi.length <= 35) {
	 pelaajanNimi = nimi;
    document.getElementById("nimi").innerHTML = nimi;
	} 
	else {
		alert("Virhe: Antamasi nimi on virheellinen!");
	}
}

// Liikuttaa parametrin mukaan pelaajaa kentällä.
// Laskee myös pisteet, jos uudessa ruudussa on rahe.
function liiku(val) { 
	let lippu = 0;
	for(let i = 0; i < kentta.length && lippu == 0; i++) {
		for(let j = 0; j < kentta[i].length && lippu == 0; j++) {
			if(kentta[i][j] == 1) {
				switch(val){
					case "up":
						if(typeof kentta[i-1][j] != "undefined"){
							if(kentta[i-1][j]  == 2) {
								pelaajanPisteet = pelaajanPisteet + 100;
							}
							else if(kentta[i-1][j]  == 3){
								pelaajanPisteet = pelaajanPisteet + 150;
							}
							kentta[i-1][j]  = 1;
							kentta[i][j]  = 0;
						}
						break;
					case "down":
						if(typeof kentta[i+1][j] != "undefined"){
							if(kentta[i+1][j]  == 2) {
								pelaajanPisteet = pelaajanPisteet + 100;
							}
							else if(kentta[i+1][j] == 3){
								pelaajanPisteet = pelaajanPisteet + 150;
							}
							kentta[i+1][j]  = 1;
							kentta[i][j]  = 0;
						}
						break;
					case "left":
						if(typeof kentta[i][j-1] != "undefined"){
							if(kentta[i][j-1]  == 2) {
								pelaajanPisteet = pelaajanPisteet + 100;
							}
							else if(kentta[i][j-1] == 3){
								pelaajanPisteet = pelaajanPisteet + 150;
							}
							kentta[i][j-1]  = 1;
							kentta[i][j]  = 0;
						}
						break;
					case "right":
						if(typeof kentta[i][j+1] != "undefined"){
							if(kentta[i][j+1]  == 2) {
								pelaajanPisteet = pelaajanPisteet + 100;
							}
							else if(kentta[i][j+1] == 3){
								pelaajanPisteet = pelaajanPisteet + 150;
							}							
							kentta[i][j+1]  = 1;
							kentta[i][j]  = 0;
						}
						break;
					default:
				}
				lippu = 1;
			}
		}
	}
	sekoita();
	piirra();
	tarkista();
}

// Piirtää pelikentän ja sen sisällön.
function piirra() {
	document.getElementById("pelialue").innerHTML = "";
	for(let i = 0; i < kentta.length; i++) {
		let div = document.createElement('div');
		div.id = "r" + i;
		div.className = "row m-0 bg-secondary text-white";
		div.style.height = 100/kentanKoko + "%";
		let jako = Math.floor(12/kentanKoko);
		for(let j = 0; j < kentta[i].length; j++) {
			let div2 = document.createElement('div');
			div2.id = "r" + i + "c" + j;
			div2.className = "col-" + jako + " p-0 border d-flex align-items-center justify-content-center"
			if(kentta[i][j] == 2) {
				let kuva = document.createElement("IMG"); 
				kuva.setAttribute("src", "img/coin.png");
				kuva.setAttribute("alt","rahe");
				div2.appendChild(kuva);
			}
			else if (kentta[i][j] == 3) {
				let kuva = document.createElement("IMG"); 
				kuva.setAttribute("src", "img/coin2.png");
				kuva.setAttribute("alt","rahe2");
				div2.appendChild(kuva);			
			}			
			else if (kentta[i][j] == 1) {
				let kuva = document.createElement("IMG"); 
				kuva.setAttribute("src", "img/player.png");
				kuva.setAttribute("alt","pelaaja");
				div2.appendChild(kuva);			
			}
			else {
			}
			div.appendChild(div2);
		}
		document.getElementById("pelialue").appendChild(div);
	}
	document.getElementById("pisteet").innerHTML = "$" + pelaajanPisteet;
}

// Tarkistaa löytyykö kentältä vielä rahee.
function tarkista(){
	loytyi = 0;
	for(let i = 0; i < kentta.length && loytyi  == 0; i++) {
		for(let j = 0; j < kentta[i].length && loytyi == 0; j++) {
			if(kentta[i][j] != 1 && kentta[i][j] != 0){
				loytyi = 1;
			}
		}
	}
	if(loytyi == 0) {
		tulos = document.getElementById("aika").innerHTML;
		alert("Peli päättyi! Aikasi: " + tulos);
		if (ennatys != null && tulos != null && tulos < ennatys){
			ennatys = tulos;
			ennatysTekija = pelaajanNimi;
		}
		else if(ennatys == null && tulos != null){
			ennatys = tulos;
			ennatysTekija = pelaajanNimi;
		}
		tarkistaKeksi();
		alusta();
	}
}

// Käynnistää ajastimen, jolla lasketaan peliaikaa.
function kaynnistaAjastin() {
	if(aika != null){
		 let aika2 = new Date();
		 let kulunut = new Date(aika2.getTime() - aika.getTime());
		 let m = kulunut.getMinutes();
		 let s = kulunut.getSeconds();
		 let ms = kulunut.getMilliseconds();
		 // Lisätään nollat, jos < 10
		 m = lisaaNollat(m,2);
		 s = lisaaNollat(s,2);
		 ms = lisaaNollat(ms,3);
		 document.getElementById("aika").innerHTML = m + ":" + s + ":" + ms;
		 ajastin = setTimeout(function(){ kaynnistaAjastin() }, 1);		
	}
}

// Lisää etunollat aikaan.
function lisaaNollat(aika, n) {
    while (aika.toString().length < n) {
        aika = "0" + aika;
    }
    return aika;
}

// Tulostaa ennätysajan.
function tulostaEnnatys(){
	if(typeof ennatys != "undefined" && typeof ennatysTekija != "undefined" && ennatys !== null && ennatysTekija !== null){
		document.getElementById("ennatys").innerHTML = ennatys;
		document.getElementById("tekija").innerHTML = ennatysTekija;
	}
	else {
		document.getElementById("ennatys").innerHTML = "--:--:---";
		document.getElementById("tekija").innerHTML = "-";
	}
}

// Asettaa parametrien mukaisen evästeen.
function asetaKeksi(knimi,karvo,vanhpvm) {
    let paiva = new Date();
    paiva.setTime(paiva.getTime() + (vanhpvm*24*60*60*1000));
    let vanhenee = "vanhenee=" + paiva.toGMTString();
    document.cookie = knimi + "=" + karvo + ";" + vanhenee + ";path=/";
}

// Lataa parametrina saadun evästeen, jos sellainen löytyy.
function lataaKeksi(knimi) {
    let ladattuNimi = knimi + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(ladattuNimi) == 0) {
            return c.substring(ladattuNimi.length, c.length);
        }
    }
    return "";
}

// Tarkistaa evästeen arvot ja muuttaa niitä tarvittaessa.
function tarkistaKeksi() {
    let aikaisempiEnnatys=lataaKeksi("ennatys");
	 let aikaisempiTekija = lataaKeksi("tekija");
	 let aikaisempiKentta = lataaKeksi("kKoko");
    if (aikaisempiEnnatys != "" && aikaisempiTekija != "" && (ennatys == null || ennatys > aikaisempiEnnatys) && aikaisempiKentta == kentanKoko) {
        ennatys = aikaisempiEnnatys;
		  ennatysTekija = aikaisempiTekija;
    } else {
       if (typeof ennatys != "undefined" && typeof ennatysTekija != "undefined" && ennatys != "" && ennatys != null && ennatysTekija != "" && ennatysTekija != null) {
           asetaKeksi("ennatys", ennatys, 30);
			  asetaKeksi("tekija", ennatysTekija, 30);
			  asetaKeksi("kKoko", kentanKoko, 30);
       }
    }
}