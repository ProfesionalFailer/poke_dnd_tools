let currentPokemon = null;

function getSpriteUrl(id) {
	return `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/refs/heads/master/portrait/${id ? id.toString().padStart(4, '0') : '0000'}/Normal.png`;
}

// Elementi del DOM
const btnLoad = document.getElementById('btn-load');
const loadingMsg = document.getElementById('loading-msg');
const displayCard = document.getElementById('display-card');
const savedListContainer = document.getElementById('saved-list');

// Inizializza l'interfaccia dei salvataggi al caricamento della pagina
document.addEventListener('DOMContentLoaded', renderSavedList);

// --- LOGICA DI CREAZIONE/CARICAMENTO POKÉMON --- //
btnLoad.addEventListener('click', async () => {
	const nameId = document.getElementById('poke-name').value.trim();
	const level = parseInt(document.getElementById('poke-level').value);
	const nature = document.getElementById('poke-nature').value.trim() || null;
	const xp = parseInt(document.getElementById('poke-xp').value) || 0;

	if (!nameId) return alert('Per favore, inserisci una specie o un ID Pokémon.');
	if (nature && !NatureUtils.checkValid(nature)) return alert('Natura inserita non valida.');

	await loadPokemonToDashboard(nameId, level, nature, xp);
});

const fakemons = {
	slowish: {
		id: 6767,
		name: 'Slowish',
		type: ['Acqua', 'Folletto'],
		base_stats: { hp: 100, atk: 60, def: 70, spa: 100, spd: 130, spe: 30 },
		base_xp: 172,
		growth_rate: 'medio-veloce',
		sprite: 'sprites/unown.webp',
	},
};

async function getFakemon(species, level, nature, xp) {
	const pokemon = new Pokemon(level, nature);
	Object.assign(pokemon, fakemons[species]);
	pokemon.levelUp(xp);

	return pokemon;
}

async function loadPokemonToDashboard(species, level, nature, xp, customName = '') {
	try {
		loadingMsg.classList.remove('hidden');
		btnLoad.disabled = true;

		console.log(species);
		console.log(typeof species);
		console.log(species.toLowerCase());

		currentPokemon = Object.keys(fakemons).find((key) => key === species.toLowerCase())
			? await getFakemon(species.toLowerCase(), level, nature, xp)
			: await Pokemon.create(species, level, nature, xp);

		document.getElementById('custom-save-name').value = customName; // Precompila se caricato dal party
		updateUI();
		displayCard.classList.remove('hidden');
	} catch (error) {
		console.error(error);
		alert('Errore nel caricamento del Pokémon. Verifica la connessione o il nome/ID.');
	} finally {
		loadingMsg.classList.add('hidden');
		btnLoad.disabled = false;
	}
}

// --- LOGICA ESPERIENZA --- //
document.getElementById('btn-add-xp').addEventListener('click', () => {
	if (!currentPokemon) return;
	const rawXp = parseInt(document.getElementById('add-raw-xp').value);
	if (!rawXp || rawXp <= 0) return;

	currentPokemon.levelUp(rawXp);
	updateUI();
	document.getElementById('add-raw-xp').value = '';
});

document.getElementById('btn-defeat').addEventListener('click', async () => {
	if (!currentPokemon) return;
	const enemyName = document.getElementById('enemy-name').value.trim();
	const enemyLevel = parseInt(document.getElementById('enemy-level').value);

	if (!enemyName || !enemyLevel) return alert('Inserisci il nome e il livello del nemico.');

	try {
		const btn = document.getElementById('btn-defeat');
		btn.disabled = true;
		btn.innerText = 'Calcolo...';

		const enemy = await Pokemon.create(enemyName, enemyLevel);
		const gainedXp = enemy.given_xp;

		alert(`Hai sconfitto ${enemy.name}! Ottenuti ${gainedXp} PE.`);
		currentPokemon.levelUp(gainedXp);
		updateUI();

		document.getElementById('enemy-name').value = '';
		document.getElementById('enemy-level').value = '';
	} catch (error) {
		alert('Impossibile caricare i dati del Pokémon nemico. Verifica il nome.');
	} finally {
		const btn = document.getElementById('btn-defeat');
		btn.disabled = false;
		btn.innerText = 'Sconfiggi e Ottieni PE';
	}
});

// --- LOGICA DI SALVATAGGIO (CACHE BROWSER) --- //
document.getElementById('btn-save-poke').addEventListener('click', () => {
	if (!currentPokemon) return;

	const customName = document.getElementById('custom-save-name').value.trim();
	if (!customName) return alert('Devi inserire un nome personalizzato per salvare il Pokémon.');

	const saves = getSaves();

	// Salviamo specie, livello, xp e natura (necessaria per ricostruire le stats corrette)
	saves[customName] = { species: currentPokemon.name, level: currentPokemon.level, xp: currentPokemon.current_xp, nature: currentPokemon.nature };

	localStorage.setItem('dnd_poke_saves', JSON.stringify(saves));
	alert(`${customName} è stato salvato/aggiornato con successo!`);
	renderSavedList();
});

function getSaves() {
	const raw = localStorage.getItem('dnd_poke_saves');
	return raw ? JSON.parse(raw) : {};
}

function renderSavedList() {
	const saves = getSaves();
	const keys = Object.keys(saves);

	if (keys.length === 0) {
		savedListContainer.innerHTML = '<p>Nessun Pokémon salvato al momento.</p>';
		return;
	}

	savedListContainer.innerHTML = '';

	keys.forEach((name) => {
		const data = saves[name];

		const itemDiv = document.createElement('div');
		itemDiv.className = 'saved-item';

		itemDiv.innerHTML = `
            <div class="saved-info">
                <strong>${name}</strong>
                <span>${data.species.toUpperCase()} - Lvl: ${data.level} | PE: ${data.xp}</span>
            </div>
            <div class="saved-actions">
                <button class="btn-load-saved" onclick="loadSaved('${name}')">Carica</button>
                <button class="btn-edit-saved" onclick="editSaved('${name}')">DM Edit</button>
                <button class="btn-delete-saved" onclick="deleteSaved('${name}')">X</button>
            </div>
        `;
		savedListContainer.appendChild(itemDiv);
	});
}

// Funzioni richiamate dai pulsanti della lista salvataggi (devono essere globali)
window.loadSaved = function (name) {
	const saves = getSaves();
	const data = saves[name];
	if (data) {
		loadPokemonToDashboard(data.species, data.level, data.nature, data.xp, name);
	}
};

window.editSaved = function (name) {
	const saves = getSaves();
	if (!saves[name]) return;

	// Richieste manuali per il DM
	const newLevel = prompt(`Inserisci il nuovo LIVELLO per ${name}:`, saves[name].level);
	if (newLevel === null) return; // annullato

	const newXp = prompt(`Inserisci i nuovi PUNTI ESPERIENZA (attuali) per ${name}:`, saves[name].xp);
	if (newXp === null) return; // annullato

	const parsedLevel = parseInt(newLevel);
	const parsedXp = parseInt(newXp);

	if (isNaN(parsedLevel) || isNaN(parsedXp) || parsedLevel < 1 || parsedLevel > 100) {
		return alert('Valori non validi. Modifica annullata.');
	}

	saves[name].level = parsedLevel;
	saves[name].xp = Math.max(0, parsedXp); // Niente PE negativi

	localStorage.setItem('dnd_poke_saves', JSON.stringify(saves));
	renderSavedList();

	// Se il Pokémon modificato è quello attualmente a schermo, aggiornalo!
	if (currentPokemon && document.getElementById('custom-save-name').value === name) {
		window.loadSaved(name);
	}
};

window.deleteSaved = function (name) {
	if (!confirm(`Sei sicuro di voler eliminare ${name} dal party?`)) return;

	const saves = getSaves();
	delete saves[name];
	localStorage.setItem('dnd_poke_saves', JSON.stringify(saves));
	renderSavedList();
};

// --- AGGIORNAMENTO INTERFACCIA --- //
function updateUI() {
	document.getElementById('display-name').innerText = currentPokemon.name;
	document.getElementById('display-level').innerText = currentPokemon.level;

	const natureObj = currentPokemon.nature ? NatureUtils.getNature(currentPokemon.nature) : null;
	document.getElementById('display-nature').innerText = natureObj ? natureObj.it : 'Neutra';

	document.getElementById('poke-sprite').src = currentPokemon.sprite == null ? getSpriteUrl(currentPokemon.id) : currentPokemon.sprite;

	const typesContainer = document.getElementById('display-types');
	typesContainer.innerHTML = '';
	currentPokemon.type.forEach((t) => {
		const span = document.createElement('span');
		span.className = 'type-badge';
		span.innerText = t;
		typesContainer.appendChild(span);
	});

	document.getElementById('current-xp').innerText = currentPokemon.current_xp;
	document.getElementById('xp-to-next').innerText = currentPokemon.xp_to_level;
	document.getElementById('total-xp').innerText = currentPokemon.total_xp + currentPokemon.current_xp;

	const xpPercent = currentPokemon.level === 100 ? 100 : (currentPokemon.current_xp / currentPokemon.xp_to_level) * 100;
	document.getElementById('xp-fill').style.width = `${Math.min(100, Math.max(0, xpPercent))}%`;

	const tbody = document.getElementById('stats-body');
	tbody.innerHTML = '';
	const statNames = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

	statNames.forEach((stat) => {
		const tr = document.createElement('tr');

		const nameTd = document.createElement('td');
		nameTd.style.fontWeight = 'bold';
		nameTd.innerText = stat.toUpperCase();

		const baseTd = document.createElement('td');
		baseTd.innerText = currentPokemon.base_stats[stat];

		const calcTd = document.createElement('td');
		calcTd.innerText = currentPokemon.stats[stat];

		const dndTd = document.createElement('td');
		const dndVal = currentPokemon.dnd_stats[stat];

		if ((stat === 'atk' || stat === 'spa') && dndVal > 0) {
			dndTd.innerText = `+${dndVal}`;
		} else {
			dndTd.innerText = dndVal;
		}

		tr.appendChild(nameTd);
		tr.appendChild(baseTd);
		tr.appendChild(calcTd);
		tr.appendChild(dndTd);
		tbody.appendChild(tr);
	});

	document.getElementById('display-tile').innerText = currentPokemon.tile ? currentPokemon.tile : 'N/D';
}
